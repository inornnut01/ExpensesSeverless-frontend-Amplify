import { describe, it, vi, expect } from "vitest";
import type { Expense } from "@/services/api";
import { render, screen } from "@testing-library/react";
import { TransactionList } from "@/components/dashboard/TransactionList";
import userEvent from "@testing-library/user-event";

describe("TransactionList", () => {
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
      amount: 500,
      category: "Salary",
      description: "Monthly salary",
      type: "income",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ];

  it("should render empty state when no expenses", () => {
    render(
      <TransactionList expenses={[]} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });
  it("should render transaction list when expenses are present", () => {
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.queryByText("No transactions found")).not.toBeInTheDocument();

    mockExpenses.forEach((expense) => {
      expect(screen.getByText(expense.description)).toBeInTheDocument();
      expect(screen.getByText(expense.category)).toBeInTheDocument();
      expect(screen.getByText(expense.type)).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(mockExpenses.length + 1);
  });

  it("should format amount with +/- prefix correctly", () => {
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("-$100.00")).toBeInTheDocument();
    expect(screen.getByText("+$500.00")).toBeInTheDocument();
  });

  it("should display correct badge variant for income/expense", () => {
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const incomeBadge = screen.getByText("income");
    const expenseBadge = screen.getByText("expense");

    expect(incomeBadge).toBeInTheDocument();
    expect(expenseBadge).toBeInTheDocument();

    expect(incomeBadge).toHaveClass("bg-primary");
    expect(incomeBadge).toHaveClass("text-primary-foreground");
    expect(expenseBadge).toHaveClass("bg-secondary");
    expect(expenseBadge).toHaveClass("text-secondary-foreground");
  });

  it("should call onEdit when edit  button clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    const editButtons = screen.getAllByRole("button", {
      name: /edit transaction/i,
    });
    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockExpenses[0]);
  });

  it("should call onDelete when delete button clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete transaction/i,
    });
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(mockExpenses[0].id);
  });
  it("should display correct date format", () => {
    render(
      <TransactionList
        expenses={mockExpenses}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(new Date(mockExpenses[0].createdAt).toLocaleDateString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockExpenses[1].createdAt).toLocaleDateString())
    ).toBeInTheDocument();
  });
});
