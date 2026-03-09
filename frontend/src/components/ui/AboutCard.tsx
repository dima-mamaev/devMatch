interface AboutCardProps {
  bio: string;
}

export function AboutCard({ bio }: AboutCardProps) {
  if (!bio) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-bold text-slate-900 mb-3">About</h2>
      <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
    </div>
  );
}
