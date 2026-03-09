"use client";

import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowRightIcon, ZapIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAuth0();

  const isFullyAuthenticated = isAuthenticated && user?.email_verified;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ZapIcon />
          </div>
          <span className="font-semibold text-gray-900">DevMatch</span>
        </Link>
        {isFullyAuthenticated ?
          <nav className="flex items-center gap-4">
            <Button variant="outline" onClick={logout} size="sm">
              Log out
            </Button>
            <Button href="dashboard/profile" size="sm">
              Profile
              <ArrowRightIcon />
            </Button>
          </nav>
          :
          <nav className="flex items-center gap-4">
            <Button variant="outline" href="/signin" size="sm">
              Sign in
            </Button>
            <Button href="/join" size="sm">
              Get Started
            </Button>
          </nav>
        }
      </div>
    </header>
  );
}
