"use client";

import { useRef, useState, useEffect } from "react";
import { PlayIcon, VideoIcon, XIcon } from "@/components/icons";
import { Media } from "@/lib/graphql/generated";

interface IntroVideoFormProps {
  introVideo: Pick<Media, "id" | "url" | "processingStatus"> | null;
  introVideoThumbnail: Pick<Media, "id" | "url"> | null;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function IntroVideoForm({
  introVideo,
  introVideoThumbnail,
  onUpload,
  isUploading = false,
}: IntroVideoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitingForProcessing, setIsWaitingForProcessing] = useState(false);

  const isProcessing = introVideo?.processingStatus === "Processing";
  const isFailed = introVideo?.processingStatus === "Failed";
  const isReady = introVideo?.processingStatus === "Ready";

  useEffect(() => {
    if (introVideo && (isProcessing || isReady)) {
      setIsWaitingForProcessing(false);
    }
  }, [introVideo, isProcessing, isReady]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      setIsWaitingForProcessing(true);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Intro Video
        </p>
        {introVideo && !isUploading && !isProcessing && !isWaitingForProcessing && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
          >
            Replace video
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {introVideo || isWaitingForProcessing ? (
        <div className="relative rounded-xl overflow-hidden bg-slate-900 h-115.5">
          {isPlaying && isReady ? (
            <>
              <video
                src={introVideo!.url}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                autoPlay
                onEnded={() => setIsPlaying(false)}
              />
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {introVideoThumbnail ? (
                <img
                  src={introVideoThumbnail.url}
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-b from-slate-700 to-slate-900" />
              )}
              {(isProcessing || isUploading || isWaitingForProcessing) && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm text-white font-medium">
                    {isUploading ? "Uploading video..." : "Processing video..."}
                  </span>
                  <span className="text-xs text-white/60">
                    This may take a moment
                  </span>
                </div>
              )}
              {isFailed && !isUploading && !isWaitingForProcessing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XIcon className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-sm text-white font-medium">
                    Processing failed
                  </span>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Try uploading again
                  </button>
                </div>
              )}
              {isReady && !isUploading && !isWaitingForProcessing && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <PlayIcon className="w-5 h-5 ml-0.5" />
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full h-115.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <VideoIcon className="w-8 h-8 text-slate-400" />
          <span className="text-xs text-slate-500">Upload intro video</span>
          <span className="text-[10px] text-slate-400">Max 60 seconds</span>
        </button>
      )}
    </div>
  );
}
