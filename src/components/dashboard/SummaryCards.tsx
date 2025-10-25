import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowDown, ArrowUp } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const SummaryCards = ({
  totalIncome,
  totalExpense,
  balance,
}: SummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalIncome.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total income this month
          </div>
          <div className="text-muted-foreground">
            Total income for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalExpense.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDown className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <ArrowDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${balance.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <ArrowUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SummaryCards;
