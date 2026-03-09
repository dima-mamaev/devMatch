"use client";

import { useRef, useState, useCallback } from "react";
import { PlayIcon } from "@/components/icons";

interface VideoPlayerProps {
  url: string;
  thumbnail?: string | null;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const aspectRatioClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-9/16",
};

export function VideoPlayer({
  url,
  thumbnail,
  className = "",
  aspectRatio = "video",
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showThumbnail, setShowThumbnail] = useState(!!thumbnail && !autoPlay);

  const handlePlayClick = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
    setShowThumbnail(false);
    onPlay?.();
  }, [onPlay]);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (thumbnail && !loop) {
      setShowThumbnail(true);
    }
    onEnded?.();
  }, [thumbnail, loop, onEnded]);

  const aspectClass = aspectRatioClasses[aspectRatio];

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-cover"
        controls={controls && !showThumbnail}
        autoPlay={autoPlay}
        muted={muted || autoPlay}
        loop={loop}
        playsInline
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={handleVideoEnded}
      />
      {showThumbnail && thumbnail && (
        <div className="absolute inset-0">
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
        </div>
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="w-16 h-16 bg-white/20 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Play video"
          >
            <PlayIcon className="w-6 h-6 text-white ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
