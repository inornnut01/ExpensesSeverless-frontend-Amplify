import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL =
  "https://kuj3p6xsrd.execute-api.us-east-1.amazonaws.com/dev/api";

interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  type: "income" | "expense";
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}

interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  categoryBreakdown: Record<string, number>;
  averageAmount: number;
  pagination: {
    limit: number;
    hasMore: boolean;
  };
}

interface GetExpensesResponse {
  expenses: Expense[];
  summary: ExpenseSummary;
  filters: ExpenseFilters;
}

class ExpenseAPI {
  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        throw new Error("No authentication token found");
      }

      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        // หากใช้ mock auth ให้ใช้ x-mock-user-id แทน
        // "x-mock-user-id": "user123"
      };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      throw error;
    }
  }

  async getExpenses(filters?: ExpenseFilters): Promise<GetExpensesResponse> {
    try {
      const headers = await this.getAuthHeaders();

      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.limit) queryParams.append("limit", filters.limit.toString());
      if (filters?.startDate)
        queryParams.append("startDate", filters.startDate);
      if (filters?.endDate) queryParams.append("endDate", filters.endDate);
      if (filters?.category) queryParams.append("category", filters.category);

      const url = `${API_BASE_URL}/get${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch expenses");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  }

  async createExpense(expenseData: {
    amount: number;
    category: string;
    description: string;
    type: "income" | "expense";
    date?: string;
    tags?: string[];
  }): Promise<Expense> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create expense");
      }

      const data = await response.json();
      return data.expense;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  }

  async updateExpense(
    expenseId: string,
    updates: Partial<{
      amount: number;
      category: string;
      description: string;
      type: "income" | "expense";
      date?: string;
      tags?: string[];
    }>
  ): Promise<Expense> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/update/${expenseId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updates),
      });
      console.log("updates", updates);
      console.log("expenseId", expenseId);
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error from backend:", errorData);
        throw new Error(errorData.message);
      }

      const data = await response.json();
      return data.expense;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub as string;

      if (!userId) {
        throw new Error("User ID not found in session");
      }
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id: expenseId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }
}

export const expenseAPI = new ExpenseAPI();
export type { Expense, ExpenseFilters, ExpenseSummary, GetExpensesResponse };
