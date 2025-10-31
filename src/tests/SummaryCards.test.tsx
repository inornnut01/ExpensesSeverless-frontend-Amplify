import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryCards from "@/components/dashboard/SummaryCards";

describe("SummaryCards", () => {
  it("Display total income", () => {
    render(
      <SummaryCards totalIncome={300} totalExpense={200} netAmount={100} />
    );
    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("$300.00")).toBeInTheDocument();
  });

  it("Display total expense", () => {
    render(
      <SummaryCards totalIncome={300} totalExpense={200} netAmount={100} />
    );
    expect(screen.getByText("Total Expense")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("Display balance", () => {
    render(
      <SummaryCards totalIncome={300} totalExpense={200} netAmount={100} />
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });
  it("Display balance when balance is negative and display red color", () => {
    const mockTotal = {
      totalIncome: 300,
      totalExpense: 400,
      netAmount: -100,
    };
    render(
      <SummaryCards
        totalIncome={mockTotal.totalIncome}
        totalExpense={mockTotal.totalExpense}
        netAmount={mockTotal.netAmount}
      />
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
    const result = screen.getByText("$-100.00");
    expect(result).toBeInTheDocument();
    expect(result).toHaveClass("text-red-500");
  });
  it("Display balance when balance is positive and display green color", () => {
    const mockTotal = {
      totalIncome: 400,
      totalExpense: 300,
      netAmount: 100,
    };
    render(
      <SummaryCards
        totalIncome={mockTotal.totalIncome}
        totalExpense={mockTotal.totalExpense}
        netAmount={mockTotal.netAmount}
      />
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
    const result = screen.getByText("$100.00");
    expect(result).toBeInTheDocument();
    expect(result).toHaveClass("text-green-500");
  });
  it("displays 'Up' badge with green icon when income > expense", () => {
    render(
      <SummaryCards totalIncome={500} totalExpense={300} netAmount={200} />
    );
    const badge = screen.getAllByText("Up")[0];
    expect(badge).toBeInTheDocument();
  });
  it("displays 'Down' badge with red icon when income < expense", () => {
    render(
      <SummaryCards totalIncome={200} totalExpense={500} netAmount={-300} />
    );
    const badges = screen.getAllByText("Down");
    expect(badges.length).toBeGreaterThan(0);
  });
  it("handles zero balance correctly", () => {
    render(<SummaryCards totalIncome={300} totalExpense={300} netAmount={0} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
