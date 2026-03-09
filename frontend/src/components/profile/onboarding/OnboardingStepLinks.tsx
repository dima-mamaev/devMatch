"use client";

import { useForm } from "react-hook-form";
import { GithubIcon, LinkedinIcon, ExternalLinkIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import { Input } from "@/components/ui/Input";

interface LinksFormData {
  githubUrl: string;
  linkedinUrl: string;
  personalSiteUrl: string;
  bio: string;
}

interface OnboardingStepLinksProps {
  onBack: (data: LinksFormData) => void;
  onContinue: (data: LinksFormData) => void;
  initialData?: {
    githubUrl?: string;
    linkedinUrl?: string;
    personalSiteUrl?: string;
    bio?: string;
  };
  isSubmitting?: boolean;
}

const MAX_BIO_LENGTH = 200;

export function OnboardingStepLinks({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepLinksProps) {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<LinksFormData>({
    mode: "onChange",
    defaultValues: {
      githubUrl: initialData?.githubUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      personalSiteUrl: initialData?.personalSiteUrl || "",
      bio: initialData?.bio || "",
    },
  });

  const formValues = watch();
  const bio = watch("bio");
  const isValid =
    formValues.githubUrl.trim().length > 0 &&
    formValues.linkedinUrl.trim().length > 0 &&
    formValues.bio.trim().length > 0;

  const onSubmit = (data: LinksFormData) => {
    onContinue({
      githubUrl: data.githubUrl.trim(),
      linkedinUrl: data.linkedinUrl.trim(),
      personalSiteUrl: data.personalSiteUrl.trim(),
      bio: data.bio.trim(),
    });
  };

  const handleBack = () => {
    onBack({
      githubUrl: formValues.githubUrl.trim(),
      linkedinUrl: formValues.linkedinUrl.trim(),
      personalSiteUrl: formValues.personalSiteUrl.trim(),
      bio: formValues.bio.trim(),
    });
  };

  return (
    <OnboardingLayout currentStep="links-bio">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            <div className="mb-5">
              <h2 className="text-[22px] font-extrabold text-slate-900">Your links</h2>
              <p className="text-sm text-slate-500 mt-1">
                Companies will check these. GitHub is most important.
              </p>
            </div>
            <Input
              label="GitHub"
              placeholder="https://github.com/username"
              icon={<GithubIcon className="w-4 h-4" />}
              error={errors.githubUrl?.message}
              {...register("githubUrl", {
                required: "GitHub URL is required",
              })}
            />
            <div className="mt-4">
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/in/username"
                icon={<LinkedinIcon className="w-4 h-4" />}
                error={errors.linkedinUrl?.message}
                {...register("linkedinUrl", {
                  required: "LinkedIn URL is required",
                })}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Personal site"
                placeholder="https://yoursite.dev"
                icon={<ExternalLinkIcon className="w-4 h-4" />}
                {...register("personalSiteUrl")}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-600">
                  Short bio
                </label>
                <span className="text-xs text-slate-400">
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <textarea
                placeholder="A few words about yourself..."
                rows={3}
                maxLength={MAX_BIO_LENGTH}
                className={`w-full px-3.5 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${errors.bio ? "border-red-300" : "border-slate-200"
                  }`}
                {...register("bio", {
                  required: "Bio is required",
                })}
              />
              {errors.bio && (
                <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </div>
          <OnboardingFooter
            onBack={handleBack}
            isValid={isValid}
            submitForm
            isLoading={isSubmitting}
          />
        </form>
      </div>
    </OnboardingLayout>
  );
}
