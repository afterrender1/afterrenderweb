import Navbar from "@/components/Navbar";

// Light page shell shared by login / signup / password pages.
export default function AuthPage({ children }) {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#0A2540] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16 sm:pt-32">{children}</div>
        </main>
    );
}
