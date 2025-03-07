export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
}