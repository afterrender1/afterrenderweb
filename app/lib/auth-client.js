"use client";

import { createAuthClient } from "better-auth/react";

// Same-origin client: talks to /api/auth on whatever domain the site is served from.
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;
