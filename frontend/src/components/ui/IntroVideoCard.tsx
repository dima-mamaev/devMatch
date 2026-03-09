import { PlayIcon } from "@/components/icons";
import { VideoPlayer } from "./VideoPlayer";

interface IntroVideoCardProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  processingStatus?: string | null;
}

export function IntroVideoCard({
  videoUrl,
  thumbnailUrl,
  processingStatus,
}: IntroVideoCardProps) {
  const hasVideo = videoUrl && processingStatus === "Ready";

  if (hasVideo) {
    return (
      <VideoPlayer
        url={videoUrl}
        thumbnail={thumbnailUrl}
        aspectRatio="portrait"
        className="bg-slate-900 border border-slate-200 rounded-2xl shadow-lg max-h-125"
      />
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-200 rounded-2xl shadow-sm aspect-video relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <PlayIcon className="w-6 h-6 text-white/50 ml-1" />
          </div>
          <p className="text-sm text-white/50">No intro video</p>
        </div>
      </div>
    </div>
  );
}
