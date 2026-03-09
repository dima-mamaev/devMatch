
interface StepCardProps {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
}

function StepCard({ icon: Icon, number, title, description }: StepCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-4xl font-bold text-gray-100">{number}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default StepCard