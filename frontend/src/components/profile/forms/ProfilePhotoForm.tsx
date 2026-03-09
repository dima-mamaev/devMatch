"use client";

import { useRef, useState } from "react";
import { MapPinIcon, CameraIcon } from "@/components/icons";
import { Media } from "@/lib/graphql/generated";

interface ProfilePhotoFormProps {
  profilePhoto: Pick<Media, "id" | "url"> | null;
  fullName: string;
  jobTitle: string;
  location: string;
  techStack: string[];
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function ProfilePhotoForm({
  profilePhoto,
  fullName,
  jobTitle,
  location,
  techStack,
  onUpload,
  isLoading = false,
}: ProfilePhotoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-slate-800 h-80"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {profilePhoto ? (
        <img
          src={profilePhoto.url}
          alt={fullName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-b from-slate-700 to-slate-900" />
      )}
      {isHovering && !isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
          <button
            type="button"
            onClick={handleUploadClick}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <CameraIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
        <h3 className="text-lg font-bold text-white">{fullName}</h3>
        <p className="text-sm text-white/80">{jobTitle || "Developer"}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
          {location && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-white/20 rounded text-xs text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
