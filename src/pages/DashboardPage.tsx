import SummaryCards from "@/components/dashboard/SummaryCards";
import SummaryChart from "@/components/dashboard/SummaryChart";
import { TransactionDialog } from "@/components/dashboard/TransactionDialog";
import TransactionFilters from "@/components/dashboard/TransactionFilters";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Salary",
    amount: 5000,
    description: "Monthly salary",
    date: "2025-01-01",
  },
  {
    id: "2",
    type: "expense",
    category: "Food",
    amount: 150,
    description: "Groceries",
    date: "2025-01-05",
  },
  {
    id: "3",
    type: "expense",
    category: "Transport",
    amount: 50,
    description: "Gas",
    date: "2025-01-10",
  },
  {
    id: "4",
    type: "income",
    category: "Freelance",
    amount: 800,
    description: "Web project",
    date: "2025-01-15",
  },
  {
    id: "5",
    type: "expense",
    category: "Entertainment",
    amount: 100,
    description: "Movie tickets",
    date: "2025-01-20",
  },
];

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transaction deleted successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Track your income and expenses
          </p>
        </div>

        <div className="space-y-6">
          <SummaryCards
            totalIncome={mockTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)}
            totalExpense={mockTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)}
            balance={
              mockTransactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0) -
              mockTransactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
            }
          />

          <SummaryChart />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          <TransactionFilters />

          <TransactionList
            transactions={mockTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <TransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={() => {}}
          editingTransaction={editingTransaction}
          categories={categories}
        />
        {/* <div className="space-y-6">
          <SummaryCards
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            balance={summary.balance}
          />

          <SummaryChart transactions={transactions} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Transactions</h2>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          <TransactionFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
          />

          <TransactionList
            transactions={filteredTransactions}
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
        /> */}
      </div>
    </div>
  );
};

export default DashboardPage;
