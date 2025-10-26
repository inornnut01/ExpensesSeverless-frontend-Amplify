import { type LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

interface StatCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({
  title,
  amount,
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm shadow-card transition-all hover:shadow-elegant hover:scale-[1.02] duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trendUp ? "text-success" : "text-destructive"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{amount}</p>
      </div>
    </Card>
  );
};

export default StatCard;
