import { useNavigate } from "@tanstack/react-router";

export function ModuleCard({ name, icon, description, path, count }: ModuleCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: path });
  };

  return (
    <div
      className="group bg-card border border-border/30 rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 bg-primary/10 rounded-md text-primary">{icon}</div>
        <div className="bg-accent/10 rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-sm font-medium">{count}</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-4 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open {name} →
      </div>
    </div>
  );
}