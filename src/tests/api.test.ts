import { describe, it, expect, vi, beforeEach } from "vitest";
import { expenseAPI } from "@/services/api";
import { fetchAuthSession } from "aws-amplify/auth";

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn(),
}));

global.fetch = vi.fn();

describe("ExpenseAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (fetchAuthSession as any).mockResolvedValue({
      tokens: {
        accessToken: { toString: () => "mock-token" },
        idToken: {
          payload: {
            sub: "mock-user-id",
          },
        },
      },
    });
  });

  describe("getExpenses", () => {
    it("should fetch expenses successfully", async () => {
      const mockResponse = {
        expenses: [{ id: "1", amount: 100 }],
        summary: { totalCount: 1 },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await expenseAPI.getExpenses();

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/get"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
          }),
        })
      );
    });

    it("should handle errors", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });

      await expect(expenseAPI.getExpenses()).rejects.toThrow("Error");
    });

    it("should build query params correctly", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [], summary: {} }),
      });

      await expenseAPI.getExpenses({
        limit: 10,
        startDate: "2024-01-01",
        category: "Food",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=10&startDate=2024-01-01&category=Food"),
        expect.any(Object)
      );
    });

    it("should include endDate in query params", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expenses: [], summary: {} }),
      });

      await expenseAPI.getExpenses({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("startDate=2024-01-01&endDate=2024-12-31"),
        expect.any(Object)
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(expenseAPI.getExpenses()).rejects.toThrow("Network error");
    });

    it("should throw error when no auth token available", async () => {
      (fetchAuthSession as any).mockResolvedValueOnce({
        tokens: undefined,
      });

      await expect(expenseAPI.getExpenses()).rejects.toThrow(
        "No authentication token found"
      );
    });
  });

  describe("createExpense", () => {
    it("should create expense successfully", async () => {
      const newExpense = {
        amount: 100,
        category: "Food",
        description: "Lunch",
        type: "expense" as const,
      };

      const mockResponse = { expense: { id: "123", ...newExpense } };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await expenseAPI.createExpense(newExpense);

      expect(result).toEqual(mockResponse.expense);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/create"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newExpense),
        })
      );
    });

    it("should handle errors", async () => {
      const newExpense = {
        amount: 100,
        category: "Food",
        description: "Lunch",
        type: "expense" as const,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });

      await expect(expenseAPI.createExpense(newExpense)).rejects.toThrow(
        "Error"
      );
    });

    it("should create expense with optional fields", async () => {
      const newExpense = {
        amount: 100,
        category: "Food",
        description: "Lunch",
        type: "expense" as const,
        date: "2024-01-01",
        tags: ["restaurant", "lunch"],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expense: { id: "123", ...newExpense } }),
      });

      const result = await expenseAPI.createExpense(newExpense);
      expect(result).toEqual({ id: "123", ...newExpense });
    });

    it("should handle network errors", async () => {
      const newExpense = {
        amount: 100,
        category: "Food",
        description: "Lunch",
        type: "expense" as const,
      };

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(expenseAPI.createExpense(newExpense)).rejects.toThrow(
        "Network error"
      );
    });
  });
  describe("updateExpense", () => {
    it("should update expense successfully", async () => {
      const updatedExpense = {
        amount: 200,
        category: "Food",
        description: "Dinner",
        type: "expense" as const,
      };
      const mockResponse = { expense: { id: "123", ...updatedExpense } };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await expenseAPI.updateExpense("123", updatedExpense);
      expect(result).toEqual(mockResponse.expense);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/update/123"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updatedExpense),
        })
      );
    });

    it("should handle errors", async () => {
      const updatedExpense = {
        amount: 200,
        category: "Food",
        description: "Dinner",
        type: "expense" as const,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Error" }),
      });

      await expect(
        expenseAPI.updateExpense("123", updatedExpense)
      ).rejects.toThrow("Error");
    });

    it("should update expense with optional fields", async () => {
      const updatedExpense = {
        amount: 200,
        category: "Food",
        description: "Dinner",
        type: "expense" as const,
        date: "2024-01-15",
        tags: ["restaurant", "dinner"],
      };
      const mockResponse = { expense: { id: "123", ...updatedExpense } };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await expenseAPI.updateExpense("123", updatedExpense);
      expect(result).toEqual(mockResponse.expense);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/update/123"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updatedExpense),
        })
      );
    });

    it("should handle network errors", async () => {
      const updatedExpense = {
        amount: 200,
        category: "Food",
        description: "Dinner",
        type: "expense" as const,
      };

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(
        expenseAPI.updateExpense("123", updatedExpense)
      ).rejects.toThrow("Network error");
    });
  });
  describe("deleteExpense", () => {
    it("should delete expense successfully", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
      await expenseAPI.deleteExpense("123");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/delete/123"),
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({ expenseId: "123", userId: "mock-user-id" }),
        })
      );
    });
    it("should handle errors", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Failed to delete" }),
      });
      await expect(expenseAPI.deleteExpense("123")).rejects.toThrow(
        "Failed to delete"
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(expenseAPI.deleteExpense("123")).rejects.toThrow(
        "Network error"
      );
    });
  });
});
