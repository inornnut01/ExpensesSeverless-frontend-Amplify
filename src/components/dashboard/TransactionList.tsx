import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Expense } from "@/services/api";

interface TransactionListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  expenses,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      expense.type === "income" ? "default" : "secondary"
                    }
                  >
                    {expense.type}
                  </Badge>
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    expense.type === "income"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {expense.type === "income" ? "+" : "-"}$
                  {Math.abs(expense.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(expense)}
                      aria-label="Edit transaction"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(expense.id)}
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
