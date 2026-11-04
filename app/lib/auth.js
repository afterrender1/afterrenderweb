import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { after } from "next/server";
import { mongoClient, authDb } from "@/app/lib/mongoClient";
import { sendExistingAccountEmail, sendPasswordResetEmail, sendVerificationEmail } from "@/app/lib/mailer";
import { isOwnAvatarUrl } from "@/app/lib/avatar";
import { safeRedirectPath } from "@/app/lib/redirect";

// Server-only. Client components must import `@/app/lib/auth-client` instead.

const NAME_MAX = 60;

const cleanName = (value) =>
    String(value ?? "")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, NAME_MAX);

// Accept both apex and www for the configured production URL.
const trustedOrigins = (() => {
    const base = process.env.BETTER_AUTH_URL;
    if (!base) return [];
    try {
        const url = new URL(base);
        const host = url.hostname;
        if (host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return [url.origin];
        const alt = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
        return [url.origin, `${url.protocol}//${alt}${url.port ? `:${url.port}` : ""}`];
    } catch {
        return [];
    }
})();

// Verification links land on /verify-email (shows success / expired-link errors),
// which then forwards the now signed-in user to where they were going.
const viaVerifyPage = (url) => {
    try {
        const link = new URL(url);
        const next = safeRedirectPath(link.searchParams.get("callbackURL"), "/profile");
        link.searchParams.set("callbackURL", `/verify-email?next=${encodeURIComponent(next)}`);
        return link.toString();
    } catch {
        return url;
    }
};

const googleConfigured =Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Emails are sent after the response is returned (keeps responses fast and avoids
// leaking whether an email exists through response timing). `after` keeps the
// serverless function alive on Vercel until the email is sent.
const runAfterResponse = (promise) => {
    try {
        after(promise);
    } catch {
        // Outside a request scope: the promise is already running, let it finish.
    }
};

export const auth = betterAuth({
    appName: "AfterRender",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,

    // Collections: users, sessions, accounts, verifications, rateLimits.
    // Passing the client enables transactions (Atlas runs replica sets).
    database: mongodbAdapter(authDb, { client: mongoClient, usePlural: true }),

    emailAndPassword: {
        enabled: true,
        // No session until the email is verified: blocks people signing up with someone else's email.
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ to: user.email, name: user.name, url });
        },
        onExistingUserSignUp: async ({ user }) => {
            const loginUrl = `${process.env.BETTER_AUTH_URL || ""}/login`;
            await sendExistingAccountEmail({ to: user.email, name: user.name, url: loginUrl });
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        // Unverified user tries to log in -> send a fresh link automatically.
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60 * 24, // 24 hours
        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail({ to: user.email, name: user.name, url: viaVerifyPage(url) });
        },
    },

    socialProviders: googleConfigured
        ? {
              google: {
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  prompt: "select_account",
              },
          }
        : {},

    account: {
        accountLinking: {
            // A verified email account and a Google account with the same email become one user.
            enabled: true,
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // extend the session once a day while the user is active
        cookieCache: {
            // Session is verified from a signed cookie for 5 minutes -> no DB hit on every request.
            enabled: true,
            maxAge: 5 * 60,
        },
    },

    rateLimit: {
        // Stored in MongoDB so limits hold across all serverless instances (active in production).
        storage: "database",
        customRules: {
            "/sign-in/email": { window: 60, max: 5 },
            "/sign-up/email": { window: 60, max: 3 },
            "/request-password-reset": { window: 60, max: 3 },
            "/send-verification-email": { window: 60, max: 3 },
            "/change-password": { window: 60, max: 5 },
            "/reset-password": { window: 60, max: 5 },
            // Called by the navbar on every page load; it's read-only and served from the
            // signed cookie cache, so skip the rate-limit DB write for it.
            "/get-session": false,
            "/ok": false,
        },
    },

    advanced: {
        // Cookies are httpOnly + SameSite=Lax, and `Secure` automatically on https.
        backgroundTasks: { handler: runAfterResponse },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    const name = cleanName(user.name) || cleanName(String(user.email).split("@")[0]);
                    if (!name) {
                        throw new APIError("BAD_REQUEST", { message: "Please enter your name." });
                    }
                    const data = { name };
                    // Email sign-up must not set an arbitrary image URL; avatars are uploaded from the profile.
                    if (ctx?.path === "/sign-up/email") data.image = null;
                    return { data };
                },
            },
            update: {
                before: async (data, ctx) => {
                    const next = {};
                    if (typeof data.name === "string") {
                        next.name = cleanName(data.name);
                        if (!next.name) {
                            throw new APIError("BAD_REQUEST", { message: "Name can't be empty." });
                        }
                    }
                    // Users may only point their image at their own Cloudinary avatar (or remove it).
                    if (ctx?.path === "/update-user" && data.image != null) {
                        const userId = ctx.context?.session?.user?.id;
                        if (!userId || !isOwnAvatarUrl(data.image, userId)) {
                            throw new APIError("BAD_REQUEST", { message: "Invalid profile image." });
                        }
                    }
                    return { data: next };
                },
            },
        },
    },

    // Must stay last: lets server actions / server code set auth cookies in Next.js.
    plugins: [nextCookies()],
});

export const isGoogleAuthEnabled = googleConfigured;
