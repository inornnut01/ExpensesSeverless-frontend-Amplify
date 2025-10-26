"use client";

import { Wallet, CircleDollarSign, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type Expense } from "@/services/api";

interface SummaryChartProps {
  expenses: Expense[];
  loading?: boolean;
}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-2)",
    icon: Wallet,
  },
  expense: {
    label: "Expense",
    color: "var(--chart-1)",
    icon: CircleDollarSign,
  },
} satisfies ChartConfig;

const SummaryChart = ({ expenses, loading = false }: SummaryChartProps) => {
  const chartData = expenses
    .filter((expense) => new Date(expense.createdAt))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((expense) => ({
      month: expense.createdAt.split("T")[0],
      income: expense.type === "income" ? expense.amount : 0,
      expense: expense.type === "expense" ? expense.amount : 0,
    }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Income and Expense</CardTitle>
        <CardDescription>Showing your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[300px] max-h-[600px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              bottom: 30,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={Math.floor(chartData.length / 6)}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="income"
              type="natural"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="var(--color-expense)"
              fillOpacity={0.4}
              stroke="var(--color-expense)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Keep doing your freedom <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SummaryChart;
