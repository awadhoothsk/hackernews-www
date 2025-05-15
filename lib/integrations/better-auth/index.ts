import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins"; 
import { serverUrl } from "@/environment";

export const betterAuthClient = createAuthClient({
  baseURL: serverUrl,
  plugins: [usernameClient(),nextCookies()],
  fetchOptions: {
    credentials: "include", 
  },
});

