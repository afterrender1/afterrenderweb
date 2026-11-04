import { redirect } from "next/navigation";
import AuthPage from "@/components/auth/AuthPage";
import SignupForm from "@/components/auth/SignupForm";
import { getServerSession } from "@/app/lib/session";
import { safeRedirectPath } from "@/app/lib/redirect";
import { isGoogleAuthEnabled } from "@/app/lib/auth";

export const metadata = {
    title: "Sign up",
    robots: { index: false, follow: false },
};

export default async function SignupPage({ searchParams }) {
    const params = await searchParams;
    const next = safeRedirectPath(params?.next);

    const session = await getServerSession();
    if (session) redirect(next);

    return (
        <AuthPage>
            <SignupForm next={next} googleEnabled={isGoogleAuthEnabled} />
        </AuthPage>
    );
}
