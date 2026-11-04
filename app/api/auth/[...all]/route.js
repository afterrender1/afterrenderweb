import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/app/lib/auth";

// All Better Auth endpoints: /api/auth/sign-in/email, /api/auth/callback/google, ...
export const { GET, POST } = toNextJsHandler(auth);
