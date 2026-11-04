import AuthPage from "@/components/auth/AuthPage";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
    title: "Reset password",
    robots: { index: false, follow: false },
    // Keep the reset token out of Referer headers sent to any third party.
    referrer: "no-referrer",
};

// Reached from the email link via /api/auth/reset-password/<token>, which redirects
// here with ?token=... when the link is valid, or ?error=INVALID_TOKEN when it isn't.
export default async function ResetPasswordPage({ searchParams }) {
    const params = await searchParams;
    const token = typeof params?.token === "string" ? params.token : "";
    const invalid = !token || Boolean(params?.error);

    return (
        <AuthPage>
            {invalid ? (
                <ForgotPasswordForm initialError="This reset link is invalid or has expired. Enter your email to get a new one." />
            ) : (
                <ResetPasswordForm token={token} />
            )}
        </AuthPage>
    );
}
