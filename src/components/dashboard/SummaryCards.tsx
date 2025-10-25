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
  netAmount: number;
}

const SummaryCards = ({
  totalIncome,
  totalExpense,
  netAmount,
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
              {totalIncome > totalExpense ? (
                <TrendingUp className="size-4 text-green-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
              {totalIncome > totalExpense ? "Up" : "Down"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalIncome > totalExpense
              ? "Your income goes up, please keep doing what you are doing."
              : "Your income goes down, please find ways to increase it."}
          </div>
          <div className="text-muted-foreground">
            <p>keep doing the right thing</p>
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
              {totalIncome < totalExpense ? (
                <TrendingUp className="size-4 text-red-500" />
              ) : (
                <TrendingDown className="size-4 text-green-500" />
              )}
              {totalIncome < totalExpense ? "Up" : "Down"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalIncome < totalExpense
              ? "Your expenses go up, please find ways to reduce them."
              : "Your expenses go down, please keep doing what you are doing."}
          </div>
          <div className="text-muted-foreground">
            <p>Tomorrow is the nice day to start saving.</p>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${
              netAmount > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ${netAmount.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {netAmount > 0 ? (
                <TrendingUp className="size-4 text-green-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
              {netAmount > 0 ? "Up" : "Down"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {netAmount > 0
              ? "Your balance goes up, please keep doing what you are doing."
              : "Your balance goes down, please find ways to increase it."}
          </div>
          <div className="text-muted-foreground">
            <p>This is for your expenses.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SummaryCards;
