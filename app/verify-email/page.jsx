import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import AuthPage from "@/components/auth/AuthPage";
import { AuthCard } from "@/components/auth/ui";
import { getServerSession } from "@/app/lib/session";
import { safeRedirectPath } from "@/app/lib/redirect";

export const metadata = {
    title: "Verify email",
    robots: { index: false, follow: false },
};

const ERRORS = {
    TOKEN_EXPIRED: "This verification link has expired.",
    INVALID_TOKEN: "This verification link is invalid or has already been used.",
    USER_NOT_FOUND: "We couldn't find an account for this link.",
    INVALID_USER: "This link belongs to a different account than the one you're logged in with.",
};

// Landing page for email verification links (see `viaVerifyPage` in app/lib/auth.js).
export default async function VerifyEmailPage({ searchParams }) {
    const params = await searchParams;
    const next = safeRedirectPath(params?.next);
    const errorCode = typeof params?.error === "string" ? params.error : "";

    if (!errorCode) {
        // Verified + auto signed in -> continue straight to where they were going.
        const session = await getServerSession();
        if (session) redirect(next);
    }

    const loginHref = `/login?${new URLSearchParams({
        ...(errorCode ? {} : { verified: "1" }),
        ...(next !== "/profile" ? { next } : {}),
    }).toString()}`;

    return (
        <AuthPage>
            <AuthCard title={errorCode ? "Link not valid" : "Email verified"}>
                <div className="flex flex-col items-center text-center">
                    {errorCode ? (
                        <XCircle size={44} className="text-red-500" />
                    ) : (
                        <CheckCircle2 size={44} className="text-emerald-500" />
                    )}
                    <p className="mt-4 text-sm text-[#425466] leading-relaxed">
                        {errorCode
                            ? `${ERRORS[errorCode] || "We couldn't verify your email with this link."} Log in with your email and password and we'll send you a fresh verification link.`
                            : "Your email address is verified. Log in to continue."}
                    </p>
                    <Link
                        href={loginHref}
                        className="mt-6 w-full h-11 inline-flex items-center justify-center rounded-xl font-bold text-sm text-[#0A2540] bg-linear-to-r from-[#48A2FF] to-[#C9E4FF] shadow-md hover:brightness-105"
                    >
                        Go to log in
                    </Link>
                </div>
            </AuthCard>
        </AuthPage>
    );
}
