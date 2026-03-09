"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
  };

  const handleEmailSignIn = async () => {
    setIsSubmitting(true);
    await signIn();
  };

  return (
    <AuthLayout>
      <header className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500">Sign in to your DevMatch account</p>
      </header>
      <Button
        variant="secondary"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="w-full"
      >
        <GoogleIcon className="w-5 h-5" />
        Continue with Google
      </Button>
      <Divider text="or" />
      <Button
        onClick={handleEmailSignIn}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Signing in..." : "Sign in with Email"}
        {!isSubmitting && <ArrowRightIcon className="w-4 h-4" />}
      </Button>
      <p className="text-center mt-6 text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/join" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Join DevMatch
        </Link>
      </p>
    </AuthLayout>
  );
}
