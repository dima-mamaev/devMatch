interface DevCardProps {
  name: string;
  role: string;
  match: number;
  skills: string[];
  image?: string;
}

function DevCard({
  name,
  role,
  match,
  skills,
  image,
}: DevCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        {image ? (
          <img src={image} alt={name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300" />
        )}
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-900">{name}</p>
          <p className="text-[10px] text-gray-500">{role}</p>
        </div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
          {match}%
        </span>
      </div>
      <div className="flex gap-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-[8px] text-gray-600 bg-gray-100 px-1 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DevCard