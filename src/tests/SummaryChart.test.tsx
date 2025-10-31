import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryChart from "@/components/dashboard/SummaryChart";
import type { Expense } from "@/services/api";

describe("SummaryChart", () => {
  it("displays loading state when loading is true", () => {
    render(<SummaryChart expenses={[]} loading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("Render with data", () => {
    const mockExpenses: Expense[] = [
      {
        id: "1",
        userId: "user1",
        amount: 100,
        category: "Food",
        description: "Lunch",
        type: "expense",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        userId: "user1",
        amount: 200,
        category: "Food",
        description: "Dinner",
        type: "income",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    ];

    render(<SummaryChart expenses={mockExpenses} loading={false} />);
    expect(screen.getByText("Your Income and Expense")).toBeInTheDocument();
    expect(
      screen.getByText("Showing your income and expenses.")
    ).toBeInTheDocument();

    expect(screen.getByText("Keep doing your freedom")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders empty state with no expenses", () => {
    render(<SummaryChart expenses={[]} loading={false} />);
    expect(screen.getByText("Your Income and Expense")).toBeInTheDocument();
    expect(
      screen.getByText("Showing your income and expenses.")
    ).toBeInTheDocument();
  });
});
