import SummaryCards from "@/components/dashboard/SummaryCards";
import SummaryChart from "@/components/dashboard/SummaryChart";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";
import TransactionFilters from "@/components/dashboard/TransactionFilters";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { expenseAPI, type Expense, type ExpenseSummary } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

const categories = [
  "Salary",
  "Freelance",
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Other",
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // API State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    limit: 25,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    category: undefined as string | undefined,
  });

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseAPI.getExpenses(filters);
      setExpenses(response.expenses);
      setSummary(response.summary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch expenses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load expenses on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, filters]);

  // Convert Expense to Transaction for UI compatibility
  const convertToTransaction = (expense: Expense): Transaction => ({
    id: expense.id,
    type: expense.type,
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
    date: expense.createdAt.split("T")[0], // Extract date part
  });

  const transactions = expenses
    .map(convertToTransaction)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await expenseAPI.deleteExpense(id);
      toast.success("Transaction deleted successfully");
      // Refresh the list
      fetchExpenses();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete transaction";
      toast.error(errorMessage);
    }
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleSave = async (
    transactionData: Omit<Transaction, "id" | "date">
  ) => {
    try {
      if (editingTransaction) {
        // Update existing
        await expenseAPI.updateExpense(editingTransaction.id, {
          amount: transactionData.amount,
          category: transactionData.category,
          description: transactionData.description,
          type: transactionData.type,
        });
        toast.success("Transaction updated successfully");
      } else {
        // Create new
        await expenseAPI.createExpense({
          amount: transactionData.amount,
          category: transactionData.category,
          description: transactionData.description,
          type: transactionData.type,
        });
        toast.success("Transaction created successfully");
      }

      setDialogOpen(false);
      setEditingTransaction(null);
      // Refresh the list
      fetchExpenses();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save transaction";
      toast.error(errorMessage);
    }
  };

  if (loading && !expenses.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Expense Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Track your income and expenses
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExpenses}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        <div className="space-y-6">
          <SummaryCards
            totalIncome={summary?.totalIncome || 0}
            totalExpense={summary?.totalExpense || 0}
            netAmount={summary?.netAmount || 0}
          />

          <SummaryChart expenses={expenses} loading={loading} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">
              Transactions {summary && `(${summary.totalCount})`}
            </h2>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          <TransactionFilters />

          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <TransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          editingTransaction={editingTransaction}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
