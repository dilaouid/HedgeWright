import { StatCardProps } from "../types/StatCardTypes";

export function StatCard({ title, value, trend, trendType }: StatCardProps) {
  const trendColor =
    trendType === 'positive'
      ? 'text-green-500'
      : trendType === 'negative'
        ? 'text-red-500'
        : 'text-muted-foreground';

  return (
    <div className="bg-card border border-border/30 rounded-lg p-6">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className={`text-sm ${trendColor}`}>{trend}</p>
      </div>
    </div>
  );
}
