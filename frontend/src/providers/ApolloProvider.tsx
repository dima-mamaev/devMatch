"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  ApolloClient,
  ApolloProvider as BaseApolloProvider,
  InMemoryCache,
  split,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient, Client } from "graphql-ws";
import {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Connection timeout in ms
const CONNECTION_TIMEOUT = 30000;
const RETRY_ATTEMPTS = 5;
const RETRY_DELAY_BASE = 1000;

// Convert HTTP URL to WebSocket URL
const getWsUrl = () => {
  if (!API_URL) return "";
  const url = new URL(API_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/graphql";
  return url.toString();
};

// Connection status context
interface ConnectionStatus {
  isConnected: boolean;
  isReconnecting: boolean;
  lastError: string | null;
}

const ConnectionStatusContext = createContext<ConnectionStatus>({
  isConnected: false,
  isReconnecting: false,
  lastError: null,
});

export const useConnectionStatus = () => useContext(ConnectionStatusContext);

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const isAuthenticatedRef = useRef(isAuthenticated);
  const getTokenRef = useRef(getAccessTokenSilently);
  const [mounted, setMounted] = useState(false);
  const wsClientRef = useRef<Client | null>(null);

  // Connection status state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isReconnecting: false,
    lastError: null,
  });

  isAuthenticatedRef.current = isAuthenticated;
  getTokenRef.current = getAccessTokenSilently;

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup WebSocket on unmount
      wsClientRef.current?.dispose();
    };
  }, []);

  const customFetch = useCallback(
    async (uri: RequestInfo | URL, options?: RequestInit) => {
      const headers = new Headers(options?.headers);

      if (isAuthenticatedRef.current) {
        try {
          const token = await getTokenRef.current();
          headers.set("Authorization", `Bearer ${token}`);
          const pendingRole =
            typeof window !== "undefined"
              ? localStorage.getItem("devmatch_pending_role")
              : null;
          if (pendingRole) {
            headers.set("X-User-Role", pendingRole);
          }
        } catch (error) {
          console.error("[Apollo] Error getting access token:", error);
        }
      }

      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);

      try {
        const response = await fetch(uri, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    []
  );

  const client = useMemo(() => {
    // Error handling link
    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
          );
        });
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError.message}`);
        setConnectionStatus((prev) => ({
          ...prev,
          lastError: networkError.message,
        }));
      }
    });

    // Retry link for failed requests
    const retryLink = new RetryLink({
      delay: {
        initial: RETRY_DELAY_BASE,
        max: RETRY_DELAY_BASE * 10,
        jitter: true,
      },
      attempts: {
        max: RETRY_ATTEMPTS,
        retryIf: (error, _operation) => {
          // Retry on network errors, not on GraphQL errors
          return !!error && !error.message?.includes("401");
        },
      },
    });

    // HTTP link for queries and mutations
    const httpLink = createUploadLink({
      uri: `${API_URL}/graphql`,
      fetch: customFetch,
    });

    // Combine HTTP links
    let link = from([errorLink, retryLink, httpLink]);

    // WebSocket link for subscriptions (only on client side)
    if (typeof window !== "undefined" && mounted) {
      const wsUrl = getWsUrl();
      if (wsUrl) {
        let reconnectAttempt = 0;

        const wsClient = createClient({
          url: wsUrl,
          connectionParams: async () => {
            if (isAuthenticatedRef.current) {
              try {
                const token = await getTokenRef.current();
                return { Authorization: `Bearer ${token}` };
              } catch (error) {
                console.error("[Apollo WS] Error getting access token:", error);
              }
            }
            return {};
          },
          retryAttempts: Infinity, // Keep retrying
          shouldRetry: () => true,
          retryWait: async (retries) => {
            // Exponential backoff with max 30 seconds
            const delay = Math.min(1000 * Math.pow(2, retries), 30000);
            await new Promise((resolve) => setTimeout(resolve, delay));
          },
          keepAlive: 10000, // Send ping every 10 seconds
          on: {
            connecting: () => {
              if (reconnectAttempt > 0) {
                setConnectionStatus((prev) => ({
                  ...prev,
                  isReconnecting: true,
                }));
              }
            },
            connected: () => {
              console.log("[Apollo WS] Connected");
              reconnectAttempt = 0;
              setConnectionStatus({
                isConnected: true,
                isReconnecting: false,
                lastError: null,
              });
            },
            closed: (event) => {
              console.log("[Apollo WS] Closed", event);
              reconnectAttempt++;
              setConnectionStatus((prev) => ({
                ...prev,
                isConnected: false,
              }));
            },
            error: (err) => {
              console.error("[Apollo WS] Error:", err);
              setConnectionStatus((prev) => ({
                ...prev,
                lastError: err instanceof Error ? err.message : "Connection error",
              }));
            },
          },
        });

        wsClientRef.current = wsClient;
        const wsLink = new GraphQLWsLink(wsClient);

        // Split between WebSocket and HTTP based on operation type
        link = split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          from([errorLink, retryLink, httpLink])
        );
      }
    }

    return new ApolloClient({
      link,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              getDevelopers: {
                keyArgs: ["filter", "sort", "paging"],
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
          errorPolicy: "all",
        },
        query: {
          fetchPolicy: "network-only",
          errorPolicy: "all",
        },
        mutate: {
          errorPolicy: "all",
        },
      },
    });
  }, [customFetch, mounted]);

  return (
    <ConnectionStatusContext.Provider value={connectionStatus}>
      <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
    </ConnectionStatusContext.Provider>
  );
}
