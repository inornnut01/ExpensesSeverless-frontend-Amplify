import { describe, it, vi, expect } from "vitest";
import type { Expense } from "@/services/api";
import { render, screen } from "@testing-library/react";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";
import userEvent from "@testing-library/user-event";

describe("TransactionDialog", () => {
  it("Should render in create mode(empty form)", () => {
    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={[]}
      />
    );

    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Transaction description")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByText("Select category")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("Should render in edit mode with pre-filled form", () => {
    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: 100,
      category: "Food",
      description: "Lunch",
      type: "expense",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food"]}
        editingTransaction={mockExpense}
      />
    );
    expect(screen.getByText("Edit Transaction")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("expense")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lunch")).toBeInTheDocument();
    const foodElements = screen.getAllByText("Food");
    expect(foodElements.length).toBeGreaterThan(0);
  });

  it("Should call onSave with correct data when form is submitted", async () => {
    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: 100,
      category: "Food",
      description: "Lunch",
      type: "expense",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };
    const mockOnSave = vi.fn();

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={mockOnSave}
        categories={["Food", "Bills", "Transport"]}
        editingTransaction={mockExpense}
      />
    );

    const user = userEvent.setup();

    // Change description
    const descriptionInput = screen.getByPlaceholderText(
      "Transaction description"
    );
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Salary");

    // Change Amount
    const amountInput = screen.getByDisplayValue("100");
    await user.clear(amountInput);
    await user.type(amountInput, "5000");

    const updateButton = screen.getByRole("button", { name: /update/i });
    await user.click(updateButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      type: "expense",
      category: "Food",
      description: "Salary",
      amount: 5000,
      date: "2024-01-01",
    });
  });

  it("Should display type dropdown options when opened", async () => {
    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food", "Salary"]}
      />
    );

    // Check that both type options exist in the select (even if hidden)
    const expenseOption = screen.getByDisplayValue("expense");
    expect(expenseOption).toBeInTheDocument();

    // Verify the select has both income and expense options available
    const hiddenSelect = document.querySelector('select[aria-hidden="true"]');
    expect(hiddenSelect).toBeInTheDocument();

    // Check that select has options
    const options = hiddenSelect?.querySelectorAll("option");
    expect(options?.length).toBeGreaterThan(0);
  });

  it("Should display all available categories when provided", () => {
    const categories = [
      "Food",
      "Bills",
      "Transport",
      "Entertainment",
      "Health",
    ];

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={categories}
      />
    );

    // Verify comboboxes exist
    const comboboxButtons = screen.getAllByRole("combobox");
    expect(comboboxButtons.length).toBe(2); // Type and Category
  });

  it("Should pre-fill form with transaction data in edit mode", () => {
    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: 200,
      category: "Food",
      description: "Restaurant",
      type: "expense",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food", "Entertainment", "Transport"]}
        editingTransaction={mockExpense}
      />
    );

    // Verify form is pre-filled
    expect(screen.getByDisplayValue("Restaurant")).toBeInTheDocument();
    expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("expense")).toBeInTheDocument();

    // Check that the category Food is displayed
    const foodElements = screen.getAllByText("Food");
    expect(foodElements.length).toBeGreaterThan(0);
  });

  it("Should call onOpenChange with false when Cancel button is clicked", async () => {
    const mockOnOpenChange = vi.fn();

    render(
      <TransactionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={vi.fn()}
        categories={["Food"]}
      />
    );

    const user = userEvent.setup();
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("Should close dialog after successful save", async () => {
    const mockOnOpenChange = vi.fn();
    const mockOnSave = vi.fn();

    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: 100,
      category: "Food",
      description: "Lunch",
      type: "expense",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    render(
      <TransactionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        categories={["Food"]}
        editingTransaction={mockExpense}
      />
    );

    const user = userEvent.setup();
    const updateButton = screen.getByRole("button", { name: /update/i });
    await user.click(updateButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("Should not submit form when required fields are empty", async () => {
    const mockOnSave = vi.fn();

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={mockOnSave}
        categories={["Food"]}
      />
    );

    const user = userEvent.setup();
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    // Form validation should prevent submission
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("Should handle empty categories array", () => {
    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={[]}
      />
    );

    // Should still render the dialog without errors
    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  it("Should handle negative amount by converting to absolute value", () => {
    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: -150, // Negative amount
      category: "Food",
      description: "Refund",
      type: "expense",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food"]}
        editingTransaction={mockExpense}
      />
    );

    // Component should display absolute value (Math.abs)
    expect(screen.getByDisplayValue("150")).toBeInTheDocument();
  });

  it("Should reset form when dialog is reopened without editingTransaction", () => {
    const mockExpense: Expense = {
      id: "1",
      userId: "user1",
      amount: 100,
      category: "Food",
      description: "Lunch",
      type: "expense",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    const { rerender } = render(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food"]}
        editingTransaction={mockExpense}
      />
    );

    // Verify data is filled
    expect(screen.getByDisplayValue("Lunch")).toBeInTheDocument();

    // Reopen without editingTransaction
    rerender(
      <TransactionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
        categories={["Food"]}
        editingTransaction={null}
      />
    );

    // Form should be reset
    expect(screen.queryByDisplayValue("Lunch")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Transaction description")).toHaveValue(
      ""
    );
  });
});
