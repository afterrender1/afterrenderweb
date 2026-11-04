import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import { PROFILE_TAB_IDS } from "@/components/profile/tabs";
import { getServerSession } from "@/app/lib/session";
import { isGoogleAuthEnabled } from "@/app/lib/auth";

export const metadata = {
    title: "My Profile",
    robots: { index: false, follow: false },
};

export default async function ProfilePage({ searchParams }) {
    const session = await getServerSession();
    if (!session) redirect("/login?next=%2Fprofile");

    const params = await searchParams;
    const requestedTab = typeof params?.tab === "string" ? params.tab : "";
    const initialTab = PROFILE_TAB_IDS.includes(requestedTab) ? requestedTab : "overview";
    // Set when connecting Google fails (redirected back with ?error=...).
    const linkError = typeof params?.error === "string" ? params.error : "";

    const { user } = session;

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#0A2540]">
            <Navbar />
            <div className="px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
                <ProfileView
                    initialUser={{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        image: user.image ?? null,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    }}
                    initialSessionId={session.session.id}
                    initialTab={linkError ? "security" : initialTab}
                    linkError={linkError}
                    googleEnabled={isGoogleAuthEnabled}
                />
            </div>
        </main>
    );
}
