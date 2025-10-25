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
import type { Transaction } from "@/pages/DashboardPage";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
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
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.type === "income" ? "default" : "secondary"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
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
