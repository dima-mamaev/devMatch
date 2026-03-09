"use client";

import {
  Auth0Provider as BaseAuth0Provider,
  AppState,
} from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export function Auth0Provider({ children }: Auth0ProviderProps) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || undefined;
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  const onRedirectCallback = (appState?: AppState) => {
    console.log("[Auth0] onRedirectCallback appState:", appState);
    router.replace(appState?.returnTo || "/dashboard");
  };

  return (
    <BaseAuth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        ...(audience && { audience }),
        scope: "openid profile email",
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </BaseAuth0Provider>
  );
}
