import { createAuthClient } from "better-auth/react";

// In the browser, default to the current page's own origin — this means
// the auth client always talks to whatever domain it's actually being
// served from, so a stale/mismatched env var can never cause a
// cross-origin request like the one that broke registration.
// Falls back to NEXT_PUBLIC_BETTER_AUTH_URL for non-browser contexts (SSR).
const baseURL =
  typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL,
});