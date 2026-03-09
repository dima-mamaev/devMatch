import { Logo } from "@/components/ui/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  progress?: number;
}

export function AuthLayout({ children, progress = 100 }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-indigo-50/50 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-125 h-125 bg-indigo-400/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-105 h-105 bg-cyan-400/20 rounded-full blur-[100px]" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <Logo className="mb-8" />
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-8">{children}</div>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} DevMatch · Made for developers, by
          developers
        </p>
      </div>
    </div>
  );
}
