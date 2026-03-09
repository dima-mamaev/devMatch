"use client";

import { useDeveloperProfile } from "@/hooks/useUser";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  useUpdateDeveloperProfileMutation,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUploadProfilePhotoMutation,
  useUploadIntroVideoMutation,
  AvailabilityStatus,
} from "@/lib/graphql/generated";

import { DeveloperOnboarding } from "./onboarding/DeveloperOnboarding";
import { AboutForm, AboutFormData } from "./forms/AboutForm";
import { AvailabilityForm } from "./forms/AvailabilityForm";
import { BasicInfoForm, BasicInfoFormData } from "./forms/BasicInfoForm";
import { ExperienceForm, AddExperienceData, UpdateExperienceData } from "./forms/ExperienceForm";
import { IntroVideoForm } from "./forms/IntroVideoForm";
import { ProfilePhotoForm } from "./forms/ProfilePhotoForm";
import { ProjectsForm, AddProjectData, UpdateProjectData } from "./forms/ProjectsForm";
import { TechStackForm, TechStackFormData } from "./forms/TechStackForm";

const REFETCH_QUERIES = ["GetMe"];

export function DeveloperProfile() {
  const profile = useDeveloperProfile();
  const { showComplete: showOnboardingComplete } = useOnboarding();

  const [updateProfile, { loading: profileLoading }] = useUpdateDeveloperProfileMutation();
  const [addProject, { loading: addProjectLoading }] = useAddProjectMutation();
  const [updateProject, { loading: updateProjectLoading }] = useUpdateProjectMutation();
  const [deleteProject, { loading: deleteProjectLoading }] = useDeleteProjectMutation();
  const [addExperience, { loading: addExperienceLoading }] = useAddExperienceMutation();
  const [updateExperience, { loading: updateExperienceLoading }] = useUpdateExperienceMutation();
  const [deleteExperience, { loading: deleteExperienceLoading }] = useDeleteExperienceMutation();
  const [uploadProfilePhoto, { loading: uploadPhotoLoading }] = useUploadProfilePhotoMutation();
  const [uploadIntroVideo, { loading: uploadVideoLoading }] = useUploadIntroVideoMutation();

  const projectsLoading = addProjectLoading || updateProjectLoading || deleteProjectLoading;
  const experiencesLoading = addExperienceLoading || updateExperienceLoading || deleteExperienceLoading;

  if (!profile || !profile.onboardingCompleted || showOnboardingComplete) {
    return <DeveloperOnboarding />;
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const handleBasicInfoSubmit = async (data: BasicInfoFormData) => {
    await updateProfile({
      variables: {
        input: {
          firstName: data.firstName,
          lastName: data.lastName,
          jobTitle: data.jobTitle,
          location: data.location,
          seniorityLevel: data.seniorityLevel,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleAboutSubmit = async (data: AboutFormData) => {
    await updateProfile({
      variables: {
        input: {
          bio: data.bio,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleTechStackSubmit = async (data: TechStackFormData) => {
    await updateProfile({
      variables: {
        input: {
          techStack: data.techStack,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleAvailabilitySubmit = async (status: AvailabilityStatus) => {
    await updateProfile({
      variables: {
        input: {
          availabilityStatus: status,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleUploadProfilePhoto = async (file: File) => {
    await uploadProfilePhoto({
      variables: {
        file,
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleUploadIntroVideo = async (file: File) => {
    await uploadIntroVideo({
      variables: {
        file,
      },
    });
    // Video is processed asynchronously, profile will be updated via polling/subscription
  };

  const handleAddProject = async (data: AddProjectData) => {
    await addProject({
      variables: {
        input: {
          name: data.name,
          description: data.description,
          url: data.url,
          techStack: data.techStack,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleUpdateProject = async (data: UpdateProjectData) => {
    await updateProject({
      variables: {
        input: {
          id: data.id,
          name: data.name,
          description: data.description,
          url: data.url,
          techStack: data.techStack,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject({
      variables: { id },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleAddExperience = async (data: AddExperienceData) => {
    await addExperience({
      variables: {
        input: {
          position: data.position,
          companyName: data.companyName,
          startYear: data.startYear,
          endYear: data.endYear,
          description: data.description,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleUpdateExperience = async (data: UpdateExperienceData) => {
    await updateExperience({
      variables: {
        input: {
          id: data.id,
          position: data.position,
          companyName: data.companyName,
          startYear: data.startYear,
          endYear: data.endYear,
          description: data.description,
        },
      },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleDeleteExperience = async (id: string) => {
    await deleteExperience({
      variables: { id },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-bold text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-400">How you appear in the feed</p>
        </div>

        {profile.availabilityStatus === "Available" && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-600">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Available
          </span>
        )}
        {profile.availabilityStatus === "OpenToOffers" && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-600">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Open to offers
          </span>
        )}
        {profile.availabilityStatus === "NotAvailable" && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-500">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            Not available
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto flex gap-6">
          {/* Left Column - Preview Card */}
          <div className="w-80 shrink-0 space-y-4">
            <ProfilePhotoForm
              profilePhoto={profile.profilePhoto || null}
              fullName={fullName}
              jobTitle={profile.jobTitle || ""}
              location={profile.location || ""}
              techStack={profile.techStack}
              onUpload={handleUploadProfilePhoto}
              isLoading={uploadPhotoLoading}
            />

            {/* Availability */}
            <AvailabilityForm
              availabilityStatus={profile.availabilityStatus || "Available"}
              onSubmit={handleAvailabilitySubmit}
              isLoading={profileLoading}
            />

            {/* Intro Video */}
            <IntroVideoForm
              introVideo={profile.introVideo || null}
              introVideoThumbnail={profile.introVideoThumbnail || null}
              onUpload={handleUploadIntroVideo}
              isUploading={uploadVideoLoading}
            />
          </div>
          <div className="flex-1 space-y-4">
            <BasicInfoForm
              firstName={profile.firstName}
              lastName={profile.lastName}
              jobTitle={profile.jobTitle!}
              location={profile.location!}
              seniorityLevel={profile.seniorityLevel!}
              onSubmit={handleBasicInfoSubmit}
              isLoading={profileLoading}
            />
            <AboutForm
              bio={profile.bio!}
              onSubmit={handleAboutSubmit}
              isLoading={profileLoading}
            />
            <TechStackForm
              techStack={profile.techStack}
              onSubmit={handleTechStackSubmit}
              isLoading={profileLoading}
            />
            <ExperienceForm
              experiences={profile.experiences}
              onAdd={handleAddExperience}
              onUpdate={handleUpdateExperience}
              onDelete={handleDeleteExperience}
              isLoading={experiencesLoading}
            />
            <ProjectsForm
              projects={profile.projects}
              onAdd={handleAddProject}
              onUpdate={handleUpdateProject}
              onDelete={handleDeleteProject}
              isLoading={projectsLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
