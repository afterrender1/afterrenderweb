import { redirect } from "next/navigation";
import AuthPage from "@/components/auth/AuthPage";
import LoginForm from "@/components/auth/LoginForm";
import { getServerSession } from "@/app/lib/session";
import { safeRedirectPath } from "@/app/lib/redirect";
import { isGoogleAuthEnabled } from "@/app/lib/auth";

export const metadata = {
    title: "Log in",
    robots: { index: false, follow: false },
};

const NOTICES = {
    reset: "Your password has been updated. Please log in with your new password.",
    verified: "Your email is verified. Please log in.",
};

export default async function LoginPage({ searchParams }) {
    const params = await searchParams;
    const next = safeRedirectPath(params?.next);

    const session = await getServerSession();
    if (session) redirect(next);

    const error = typeof params?.error === "string" ? params.error : "";
    const notice = params?.reset ? NOTICES.reset : params?.verified ? NOTICES.verified : "";

    return (
        <AuthPage>
            <LoginForm next={next} oauthError={error} notice={notice} googleEnabled={isGoogleAuthEnabled} />
        </AuthPage>
    );
}
