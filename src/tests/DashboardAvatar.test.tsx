import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardAvatar from "@/components/dashboard/DashboardAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { signOut } from "aws-amplify/auth";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("aws-amplify/auth", () => ({
  signOut: vi.fn(),
}));

describe("DashboardAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Display user info", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      userId: "123",
    };
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
    render(
      <BrowserRouter>
        <DashboardAvatar />
      </BrowserRouter>
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });
  it("Dropdown menu opens", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      userId: "123",
    };
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
    render(
      <BrowserRouter>
        <DashboardAvatar />
      </BrowserRouter>
    );
    const avatarButton = screen.getByRole("button");
    await userEvent.click(avatarButton);
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("Sign out", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      userId: "123",
    };
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
    render(
      <BrowserRouter>
        <DashboardAvatar />
      </BrowserRouter>
    );
    const avatarButton = screen.getByRole("button");
    await userEvent.click(avatarButton);

    const signOutButton = screen.getByText("Log out");
    await userEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe("/");
  });

  it("Home link navigates to home page", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      userId: "123",
    };
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
    render(
      <BrowserRouter>
        <DashboardAvatar />
      </BrowserRouter>
    );
    const avatarButton = screen.getByRole("button");
    await userEvent.click(avatarButton);

    const homeButton = screen.getByText("Home");
    await userEvent.click(homeButton);

    expect(window.location.pathname).toBe("/");
  });
});
