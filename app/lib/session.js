import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

// Current user's session in Server Components / Route Handlers, or null when signed out.
export const getServerSession = async () => {
    // Outside the try: Next.js uses this call to mark the page as dynamic (per-request),
    // so its internal signal must not be swallowed by the catch below.
    const requestHeaders = await headers();
    try {
        return await auth.api.getSession({ headers: requestHeaders });
    } catch (err) {
        console.error("getServerSession failed:", err);
        return null;
    }
};
