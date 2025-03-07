export function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 hover:bg-blue-900/50 transition-colors">
      <div className="text-4xl mb-3 text-center">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-center">{title}</h3>
      <p className="text-blue-200 text-sm">{description}</p>
    </div>
  );
}