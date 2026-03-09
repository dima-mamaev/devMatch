"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  MailIcon,
  GoogleIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { RoleCard } from "@/components/ui/RoleCard";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/graphql";

export default function JoinPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { signUp, signUpWithGoogle, isLoading } = useAuth();

  const handleGoogleSignUp = async () => {
    if (!selectedRole) return;
    await signUpWithGoogle(selectedRole);
  };

  const handleEmailSignUp = async () => {
    if (!selectedRole) return;
    await signUp({ role: selectedRole });
  };

  return (
    <AuthLayout progress={step === 1 ? 33 : 66}>
      {step === 1 ? (
        <>
          <header className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Join DevMatch</h1>
            <p className="text-sm text-gray-500">First, tell us who you are</p>
          </header>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <RoleCard
              role="Developer"
              selected={selectedRole === "Developer"}
              onSelect={() => setSelectedRole("Developer")}
            />
            <RoleCard
              role="Recruiter"
              selected={selectedRole === "Recruiter"}
              onSelect={() => setSelectedRole("Recruiter")}
            />
          </div>
          <Button onClick={() => setStep(2)} disabled={!selectedRole} className="w-full">
            Continue
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <>
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Back
          </button>
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">Choose how you want to sign up</p>
          </header>
          <Button
            variant="secondary"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full"
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </Button>
          <Divider text="or" />
          <Button
            onClick={handleEmailSignUp}
            disabled={isLoading}
            className="w-full"
          >
            <MailIcon className="w-4 h-4" />
            {isLoading ? "Redirecting..." : "Continue with Email"}
          </Button>
          <p className="text-center mt-6 text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
