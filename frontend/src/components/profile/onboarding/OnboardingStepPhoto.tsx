"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CameraIcon, UploadIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface PhotoFormData {
  firstName: string;
  lastName: string;
}

interface OnboardingStepPhotoProps {
  onBack: (data: { firstName: string; lastName: string; photo: File | null; photoPreview: string | null }) => void;
  onContinue: (data: { firstName: string; lastName: string; photo: File | null; photoPreview: string | null }) => void;
  initialData?: {
    firstName?: string;
    lastName?: string;
    photo?: File | null;
    photoPreview?: string | null;
  };
  isSubmitting?: boolean;
}

export function OnboardingStepPhoto({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepPhotoProps) {

  const [photo, setPhoto] = useState<File | null>(initialData?.photo || null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoPreview || null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PhotoFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
    },
  });

  const formValues = watch();

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image");
      return;
    }
    setPhoto(file);
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const onSubmit = (data: PhotoFormData) => {
    if (!photo && !photoPreview) {
      setPhotoError("Photo is required");
      return;
    }
    onContinue({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      photo,
      photoPreview,
    });
  };

  const handleBack = () => {
    onBack({
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      photo,
      photoPreview,
    });
  };

  const isFormComplete = isValid && (photo !== null || photoPreview !== null);

  return (
    <OnboardingLayout currentStep="photo-name">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-[22px] font-extrabold text-slate-900">Your photo</h2>
              <p className="text-sm text-slate-500 mt-1">
                A real photo gets 8× more clicks than an avatar or logo.
              </p>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div
                  className={`w-36 h-36 rounded-full border-[2.5px] border-dashed flex items-center justify-center bg-slate-50 overflow-hidden transition-colors cursor-pointer ${isDragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <CameraIcon className="w-7 h-7" />
                      <div className="text-xs font-medium text-center leading-tight">
                        <p>Drop photo</p>
                        <p>or click</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="icon"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full shadow-md"
                >
                  <UploadIcon className="w-3.5 h-3.5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-400 mt-4">JPG, PNG, WEBP · max 10 MB</p>
              {photoError && (
                <p className="text-xs text-red-500 mt-1">{photoError}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Alex"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 1, message: "First name is required" },
                })}
              />
              <Input
                label="Last name"
                placeholder="Johnson"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 1, message: "Last name is required" },
                })}
              />
            </div>
          </div>
          <OnboardingFooter
            onBack={handleBack}
            isValid={isFormComplete}
            submitForm
            isLoading={isSubmitting}
          />
        </form>
      </div>
    </OnboardingLayout>
  );
}
