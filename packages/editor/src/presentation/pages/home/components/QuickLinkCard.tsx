/* eslint-disable react/react-in-jsx-scope */
import { ChevronRight } from "lucide-react";

export function QuickLinkCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/5 transition-colors cursor-pointer">
      <div className="flex items-start">
        <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
