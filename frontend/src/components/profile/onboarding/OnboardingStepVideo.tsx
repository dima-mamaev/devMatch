"use client";

import { useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { UploadIcon, VideoIcon, PlayIcon, XIcon } from "@/components/icons";
import { OnboardingLayout } from "./OnboardingLayout";
import { OnboardingFooter } from "./OnboardingFooter";
import { Button } from "@/components/ui/Button";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

interface VideoFormData {
  introVideo: File | null;
  videoPreview: string | null;
  isDragging: boolean;
  error: string | null;
}

interface OnboardingStepVideoProps {
  onBack: (data: { introVideo: File | null; videoPreview: string | null }) => void;
  onContinue: (data: { introVideo: File | null; videoPreview: string | null }) => void;
  initialData?: {
    introVideo?: File | null;
    videoPreview?: string | null;
  };
  isSubmitting?: boolean;
}

const tips = [
  "Keep it under 2 minutes",
  "Show your screen or live code",
  "Talk about your proudest project",
  "Mention what kind of role you're looking for",
];

export function OnboardingStepVideo({ onBack, onContinue, initialData, isSubmitting }: OnboardingStepVideoProps) {
  const { watch, setValue } = useForm<VideoFormData>({
    mode: "onChange",
    defaultValues: {
      introVideo: initialData?.introVideo || null,
      videoPreview: initialData?.videoPreview || null,
      isDragging: false,
      error: null,
    },
  });

  const introVideo = watch("introVideo");
  const videoPreview = watch("videoPreview");
  const isDragging = watch("isDragging");
  const error = watch("error");
  const isValid = introVideo !== null || videoPreview !== null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return "Please upload MP4, MOV, or WEBM format";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be under 100MB";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setValue("error", validationError);
      return;
    }

    setValue("error", null);
    setValue("introVideo", file);
    const previewUrl = URL.createObjectURL(file);
    setValue("videoPreview", previewUrl);
  }, [setValue]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setValue("isDragging", false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, setValue]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setValue("isDragging", true);
  }, [setValue]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setValue("isDragging", false);
  }, [setValue]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveVideo = () => {
    setValue("introVideo", null);
    setValue("videoPreview", null);
    setValue("error", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    if (introVideo || videoPreview) {
      onContinue({ introVideo, videoPreview });
    }
  };

  const handleBack = () => {
    onBack({ introVideo, videoPreview });
  };

  return (
    <OnboardingLayout currentStep="intro-video">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm w-full max-w-130 overflow-hidden">
        <div className="p-8">
          <div className="mb-5">
            <h2 className="text-[22px] font-extrabold text-slate-900">Intro video 🎬</h2>
            <p className="text-sm text-slate-500 mt-1">
              This is what makes DevMatch different. A 60–120 sec video gets you{" "}
              <span className="font-semibold text-indigo-600">hired 12× faster</span>.
            </p>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={!videoPreview ? handleChooseFile : undefined}
            className={`relative border-2 border-dashed rounded-2xl transition-colors ${isDragging
              ? "border-indigo-400 bg-indigo-50"
              : videoPreview
                ? "border-slate-200 bg-slate-50"
                : "border-slate-300 bg-slate-50 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50"
              } ${videoPreview ? "p-0" : "p-8"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileSelect}
              className="hidden"
            />
            {videoPreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <video
                  src={videoPreview}
                  className="w-full h-full object-cover"
                  controls
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo();
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <VideoIcon className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-slate-700">Drop your video here</p>
                  <p className="text-sm text-slate-400 mt-1">or click to browse · MP4, MOV, WEBM</p>
                </div>
                <Button
                  variant="primary"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChooseFile();
                  }}
                >
                  <UploadIcon className="w-4 h-4" />
                  Choose file
                </Button>
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
          <div className="mt-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tips for a great video
            </p>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                    <PlayIcon className="w-2 h-2 text-indigo-600" />
                  </div>
                  <span className="text-sm text-slate-600">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <OnboardingFooter
          onBack={handleBack}
          onContinue={handleContinue}
          continueLabel="Finish"
          isValid={isValid}
          isLoading={isSubmitting}
        />
      </div>
    </OnboardingLayout>
  );
}
