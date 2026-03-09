"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  ApolloClient,
  ApolloProvider as BaseApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { useMemo, useRef, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const isAuthenticatedRef = useRef(isAuthenticated);
  const getTokenRef = useRef(getAccessTokenSilently);

  isAuthenticatedRef.current = isAuthenticated;
  getTokenRef.current = getAccessTokenSilently;

  const customFetch = useCallback(async (uri: RequestInfo | URL, options?: RequestInit) => {
    const headers = new Headers(options?.headers);

    if (isAuthenticatedRef.current) {
      try {
        const token = await getTokenRef.current();
        headers.set("Authorization", `Bearer ${token}`);

        const pendingRole = typeof window !== "undefined"
          ? localStorage.getItem("devmatch_pending_role")
          : null;
        if (pendingRole) {
          headers.set("X-User-Role", pendingRole === "recruiter" ? "Recruiter" : "Developer");
        }
      } catch (error) {
        console.error("[Apollo] Error getting access token:", error);
      }
    }

    return fetch(uri, { ...options, headers });
  }, []);

  const client = useMemo(() => {
    const uploadLink = createUploadLink({
      uri: `${API_URL}/graphql`,
      fetch: customFetch,
    });

    return new ApolloClient({
      link: uploadLink,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              getDevelopers: {
                keyArgs: ["filter", "sort"],
                merge(existing, incoming, { args }) {
                  if (!args?.paging?.page || args.paging.page === 1) {
                    return incoming;
                  }
                  return {
                    ...incoming,
                    results: [...(existing?.results || []), ...incoming.results],
                  };
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
