"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeveloperOnboardingIntro } from "./DeveloperOnboardingIntro";
import { OnboardingStepPhoto } from "./OnboardingStepPhoto";
import { OnboardingStepRole } from "./OnboardingStepRole";
import { OnboardingStepExperience } from "./OnboardingStepExperience";
import { OnboardingStepTechStack } from "./OnboardingStepTechStack";
import { OnboardingStepLinks } from "./OnboardingStepLinks";
import { OnboardingStepVideo } from "./OnboardingStepVideo";
import { OnboardingStepComplete } from "./OnboardingStepComplete";
import {
  SeniorityLevel,
  Developer,
  useUpdateDeveloperProfileMutation,
  useUploadProfilePhotoMutation,
  useUploadIntroVideoMutation,
} from "@/lib/graphql/generated";
import { useDeveloperProfile } from "@/hooks/useUser";
import { useOnboarding } from "@/contexts/OnboardingContext";

const REFETCH_QUERIES = ["GetMe"];

export type OnboardingStep =
  | "intro"
  | "photo-name"
  | "role-location"
  | "experience"
  | "tech-stack"
  | "links-bio"
  | "intro-video"
  | "complete";

export interface OnboardingData {
  firstName: string;
  lastName: string;
  photo: File | null;
  photoPreview: string | null;
  jobTitle: string;
  location: string;
  seniorityLevel: SeniorityLevel | null;
  techStack: string[];
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  personalSiteUrl: string;
  introVideo: File | null;
  videoPreview: string | null;
}

function getStartingStep(profile: Developer | null): OnboardingStep {
  if (!profile) return "intro";
  if (!(profile.firstName && profile.lastName && profile.profilePhoto)) return "photo-name";
  if (!(profile.jobTitle && profile.location)) return "role-location";
  if (!profile.seniorityLevel) return "experience";
  if (profile.techStack.length === 0) return "tech-stack";
  if (!(profile.bio && profile.githubUrl && profile.linkedinUrl)) return "links-bio";
  if (!profile.introVideo) return "intro-video";
  return "complete";
}

export function DeveloperOnboarding() {
  const router = useRouter();
  const currentProfile = useDeveloperProfile();
  const { showComplete: showOnboardingComplete, setShowComplete } = useOnboarding();
  const startingStep = useMemo(() => {
    if (showOnboardingComplete) return "complete";
    return getStartingStep(currentProfile);
  }, [currentProfile, showOnboardingComplete]);
  const hasExistingData = !!currentProfile;
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    hasExistingData ? startingStep : "intro"
  );
  const [data, setData] = useState<OnboardingData>({
    firstName: currentProfile?.firstName || "",
    lastName: currentProfile?.lastName || "",
    photo: null,
    photoPreview: currentProfile?.profilePhoto?.url || null,
    jobTitle: currentProfile?.jobTitle || "",
    location: currentProfile?.location || "",
    seniorityLevel: currentProfile?.seniorityLevel || null,
    techStack: currentProfile?.techStack || [],
    bio: currentProfile?.bio || "",
    githubUrl: currentProfile?.githubUrl || "",
    linkedinUrl: currentProfile?.linkedinUrl || "",
    personalSiteUrl: currentProfile?.personalSiteUrl || "",
    introVideo: null,
    videoPreview: currentProfile?.introVideo?.url || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateDeveloperProfile] = useUpdateDeveloperProfileMutation();
  const [uploadProfilePhoto] = useUploadProfilePhotoMutation();
  const [uploadIntroVideo] = useUploadIntroVideoMutation();

  useEffect(() => {
    if (currentProfile) {
      setData((prev) => ({
        ...prev,
        firstName: currentProfile.firstName || prev.firstName,
        lastName: currentProfile.lastName || prev.lastName,
        photoPreview: currentProfile.profilePhoto?.url || prev.photoPreview,
        jobTitle: currentProfile.jobTitle || prev.jobTitle,
        location: currentProfile.location || prev.location,
        seniorityLevel: currentProfile.seniorityLevel || prev.seniorityLevel,
        techStack: currentProfile.techStack.length > 0 ? currentProfile.techStack : prev.techStack,
        bio: currentProfile.bio || prev.bio,
        githubUrl: currentProfile.githubUrl || prev.githubUrl,
        linkedinUrl: currentProfile.linkedinUrl || prev.linkedinUrl,
        personalSiteUrl: currentProfile.personalSiteUrl || prev.personalSiteUrl,
        videoPreview: currentProfile.introVideo?.url || prev.videoPreview,
      }));
      setCurrentStep((prev) => {
        if (prev === "intro") {
          if (showOnboardingComplete) return "complete";
          return getStartingStep(currentProfile);
        }
        return prev;
      });
    }
  }, [currentProfile, showOnboardingComplete]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleIntroStart = () => {
    setCurrentStep("photo-name");
  };

  const handlePhotoComplete = async (stepData: {
    firstName: string;
    lastName: string;
    photo: File | null;
    photoPreview: string | null;
  }) => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            firstName: stepData.firstName,
            lastName: stepData.lastName,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      let newPhotoUrl: string | undefined;
      if (stepData.photo) {
        const { data: photoData } = await uploadProfilePhoto({
          variables: { file: stepData.photo },
          refetchQueries: REFETCH_QUERIES,
        });
        newPhotoUrl = photoData?.uploadProfilePhoto?.url;
      }
      updateData({
        firstName: stepData.firstName,
        lastName: stepData.lastName,
        photo: null,
        photoPreview: newPhotoUrl || stepData.photoPreview,
      });
      setCurrentStep("role-location");
    } catch (error) {
      console.error("Failed to save photo step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoBack = (stepData: {
    firstName: string;
    lastName: string;
    photo: File | null;
    photoPreview: string | null;
  }) => {
    updateData({
      firstName: stepData.firstName,
      lastName: stepData.lastName,
      photo: stepData.photo,
      photoPreview: stepData.photoPreview,
    });
    setCurrentStep("intro");
  };

  const handleRoleComplete = async (stepData: { jobTitle: string; location: string }) => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            jobTitle: stepData.jobTitle,
            location: stepData.location,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      updateData({
        jobTitle: stepData.jobTitle,
        location: stepData.location,
      });
      setCurrentStep("experience");
    } catch (error) {
      console.error("Failed to save role step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleBack = (stepData: { jobTitle: string; location: string }) => {
    updateData({
      jobTitle: stepData.jobTitle,
      location: stepData.location,
    });
    setCurrentStep("photo-name");
  };

  const handleExperienceComplete = async (stepData: { seniorityLevel: SeniorityLevel }) => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            seniorityLevel: stepData.seniorityLevel,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      updateData({
        seniorityLevel: stepData.seniorityLevel,
      });
      setCurrentStep("tech-stack");
    } catch (error) {
      console.error("Failed to save experience step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExperienceBack = (stepData: { seniorityLevel: SeniorityLevel | null }) => {
    updateData({
      seniorityLevel: stepData.seniorityLevel,
    });
    setCurrentStep("role-location");
  };

  const handleTechStackComplete = async (stepData: { techStack: string[] }) => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            techStack: stepData.techStack,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      updateData({
        techStack: stepData.techStack,
      });
      setCurrentStep("links-bio");
    } catch (error) {
      console.error("Failed to save tech stack step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechStackBack = (stepData: { techStack: string[] }) => {
    updateData({ techStack: stepData.techStack });
    setCurrentStep("experience");
  };

  const handleLinksComplete = async (stepData: {
    githubUrl: string;
    linkedinUrl: string;
    personalSiteUrl: string;
    bio: string;
  }) => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            bio: stepData.bio,
            githubUrl: stepData.githubUrl,
            linkedinUrl: stepData.linkedinUrl,
            personalSiteUrl: stepData.personalSiteUrl || undefined,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      updateData({
        githubUrl: stepData.githubUrl,
        linkedinUrl: stepData.linkedinUrl,
        personalSiteUrl: stepData.personalSiteUrl,
        bio: stepData.bio,
      });
      setCurrentStep("intro-video");
    } catch (error) {
      console.error("Failed to save links step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinksBack = (stepData: {
    githubUrl: string;
    linkedinUrl: string;
    personalSiteUrl: string;
    bio: string;
  }) => {
    updateData({
      githubUrl: stepData.githubUrl,
      linkedinUrl: stepData.linkedinUrl,
      personalSiteUrl: stepData.personalSiteUrl,
      bio: stepData.bio,
    });
    setCurrentStep("tech-stack");
  };

  const handleVideoComplete = async (stepData: {
    introVideo: File | null;
    videoPreview: string | null;
  }) => {
    try {
      setIsSubmitting(true);
      if (stepData.introVideo) {
        await uploadIntroVideo({
          variables: { file: stepData.introVideo },
        });
      }
      updateData({
        introVideo: null,
        videoPreview: stepData.videoPreview,
      });
      setShowComplete(true);
      setCurrentStep("complete");
    } catch (error) {
      console.error("Failed to save video step:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoBack = (stepData: {
    introVideo: File | null;
    videoPreview: string | null;
  }) => {
    updateData({
      introVideo: stepData.introVideo,
      videoPreview: stepData.videoPreview,
    });
    setCurrentStep("links-bio");
  };

  const handleBrowseFeed = async () => {
    try {
      setIsSubmitting(true);
      await updateDeveloperProfile({
        variables: {
          input: {
            onboardingCompleted: true,
          },
        },
        refetchQueries: REFETCH_QUERIES,
      });
      setShowComplete(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  switch (currentStep) {
    case "intro":
      return (
        <DeveloperOnboardingIntro onStart={handleIntroStart} />
      );

    case "photo-name":
      return (
        <OnboardingStepPhoto
          onBack={handlePhotoBack}
          onContinue={handlePhotoComplete}
          initialData={{
            firstName: data.firstName,
            lastName: data.lastName,
            photo: data.photo,
            photoPreview: data.photoPreview,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "role-location":
      return (
        <OnboardingStepRole
          onBack={handleRoleBack}
          onContinue={handleRoleComplete}
          initialData={{
            jobTitle: data.jobTitle,
            location: data.location,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "experience":
      return (
        <OnboardingStepExperience
          onBack={handleExperienceBack}
          onContinue={handleExperienceComplete}
          initialData={{
            seniorityLevel: data.seniorityLevel || undefined,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "tech-stack":
      return (
        <OnboardingStepTechStack
          onBack={handleTechStackBack}
          onContinue={handleTechStackComplete}
          initialData={{
            techStack: data.techStack,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "links-bio":
      return (
        <OnboardingStepLinks
          onBack={handleLinksBack}
          onContinue={handleLinksComplete}
          initialData={{
            githubUrl: data.githubUrl,
            linkedinUrl: data.linkedinUrl,
            personalSiteUrl: data.personalSiteUrl,
            bio: data.bio,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "intro-video":
      return (
        <OnboardingStepVideo
          onBack={handleVideoBack}
          onContinue={handleVideoComplete}
          initialData={{
            introVideo: data.introVideo,
            videoPreview: data.videoPreview,
          }}
          isSubmitting={isSubmitting}
        />
      );

    case "complete":
      return (
        <OnboardingStepComplete
          profileData={{
            firstName: data.firstName,
            lastName: data.lastName,
            jobTitle: data.jobTitle,
            techStack: data.techStack,
            seniorityLevel: data.seniorityLevel,
            photoPreview: data.photoPreview,
          }}
          onBrowseFeed={handleBrowseFeed}
          isSubmitting={isSubmitting}
        />
      );

    default:
      return null;
  }
}
