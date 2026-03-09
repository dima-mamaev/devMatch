import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Auth0Provider } from "@/providers/Auth0Provider";
import { ApolloProvider } from "@/providers/ApolloProvider";
import { ShortlistSync } from "@/providers/ShortlistSync";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevMatch",
  description: "Find your next developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth0Provider>
          <ApolloProvider>
            <ShortlistSync>
              <OnboardingProvider>{children}</OnboardingProvider>
            </ShortlistSync>
          </ApolloProvider>
        </Auth0Provider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
