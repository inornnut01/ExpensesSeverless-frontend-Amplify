import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  fetchAuthSession,
  getCurrentUser,
  signIn as amplifySignIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signOut,
} from "aws-amplify/auth";
import { render, screen, waitFor, act } from "@testing-library/react";

// Mock Amplify
vi.mock("aws-amplify", () => ({
  Amplify: {
    configure: vi.fn(),
  },
}));

// Mock aws-amplify/auth functions
vi.mock("aws-amplify/auth");

const TestComponentSignIn = () => {
  const { user, loading, signIn } = useAuth();

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User: {user.username}</div> : null}
      <button onClick={() => signIn("test@test.com", "password")}>
        Sign In
      </button>
    </div>
  );
};

const TestComponentSignUp = () => {
  const { user, loading, signUp } = useAuth();
  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User: {user.username}</div> : null}
      <button onClick={() => signUp("testuser", "test@test.com", "password")}>
        Sign Up
      </button>
    </div>
  );
};

const TestComponentConfirmSignUp = () => {
  const { user, loading, confirmSignUp } = useAuth();
  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User: {user.username}</div> : null}
      <button onClick={() => confirmSignUp("testuser", "123456")}>
        Confirm Sign Up
      </button>
    </div>
  );
};

const TestComponentResendConfirmationCode = () => {
  const { user, loading, resendConfirmationCode } = useAuth();
  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User: {user.username}</div> : null}
      <button onClick={() => resendConfirmationCode("testuser")}>
        Resend Confirmation Code
      </button>
    </div>
  );
};

const TestComponentSignOut = () => {
  const { user, loading, signOut, signIn } = useAuth();
  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User: {user.username}</div> : null}
      <button onClick={() => signIn("testuser", "password")}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe("AuthContext", () => {
  const originalError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for expected auth errors
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("should start with loading state", () => {
    vi.mocked(getCurrentUser).mockImplementation(
      () =>
        new Promise((_, reject) => {
          // Delay rejection to ensure loading state is visible
          setTimeout(() => reject(new Error("Not authenticated")), 100);
        })
    );

    render(
      <AuthProvider>
        <TestComponentSignIn />
      </AuthProvider>
    );

    // Initially should show loading (before async checkAuth completes)
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should set user after successful authentication check", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponentSignIn />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should handle authentication failure gracefully", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error("Not authenticated"));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponentSignIn />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle sign in successfully", async () => {
    // Initial auth check fails
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    // Sign in succeeds
    vi.mocked(amplifySignIn).mockResolvedValue({
      isSignedIn: true,
      nextStep: { signInStep: "DONE" }, //such as MFA
    } as any);

    // After sign in, getCurrentUser succeeds
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    render(
      <AuthProvider>
        <TestComponentSignIn />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const signInButton = screen.getByText("Sign In");

    await act(async () => {
      signInButton.click();
    });

    await waitFor(
      () => {
        expect(screen.getByText("User: testuser")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should handle sign up successfully", async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(signUp).mockResolvedValue({
      isSignUpComplete: false,
      nextStep: {
        signUpStep: "CONFIRM_SIGN_UP",
      },
    } as any);

    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        accessToken: { toString: () => "mock-token" },
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    render(
      <AuthProvider>
        <TestComponentSignUp />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const signUpButton = screen.getByText("Sign Up");

    await act(async () => {
      signUpButton.click();
    });

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        username: "testuser",
        password: "password",
        options: {
          userAttributes: {
            email: "test@test.com",
          },
        },
      });
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle confirm sign up successfully", async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(confirmSignUp).mockResolvedValue({
      isSignUpComplete: true,
      nextStep: { signUpStep: "DONE" },
    } as any);

    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        accessToken: { toString: () => "mock-token" },
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    render(
      <AuthProvider>
        <TestComponentConfirmSignUp />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const confirmSignUpButton = screen.getByText("Confirm Sign Up");

    await act(async () => {
      confirmSignUpButton.click();
    });

    await waitFor(() => {
      expect(confirmSignUp).toHaveBeenCalledWith({
        username: "testuser",
        confirmationCode: "123456", // 6-digit confirmation code
      });
    });
    expect(screen.queryByText(/User:/)).toBeInTheDocument();
  });

  it("should handle resend confirmation code successfully", async () => {
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(resendSignUpCode).mockResolvedValue({
      destination: "t***@test.com",
      deliveryMedium: "EMAIL",
      attributeName: "email",
    } as any);

    render(
      <AuthProvider>
        <TestComponentResendConfirmationCode />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const resendConfirmationCodeButton = screen.getByText(
      "Resend Confirmation Code"
    );

    await act(async () => {
      resendConfirmationCodeButton.click();
    });

    await waitFor(() => {
      expect(resendSignUpCode).toHaveBeenCalledWith({
        username: "testuser",
      });
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle sign in and sign out successfully", async () => {
    // Reset all mocks first
    vi.mocked(getCurrentUser).mockReset();
    vi.mocked(fetchAuthSession).mockReset();
    vi.mocked(amplifySignIn).mockReset();
    vi.mocked(signOut).mockReset();

    // Initial auth check fails
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    // Sign in succeeds
    vi.mocked(amplifySignIn).mockResolvedValue({
      isSignedIn: true,
      nextStep: { signInStep: "DONE" },
    } as any);

    // After sign in, getCurrentUser returns user data
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      username: "testuser",
      userId: "123",
    });

    // Mock fetchAuthSession for getting user email
    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    // Mock signOut from aws-amplify
    vi.mocked(signOut).mockResolvedValue(undefined as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponentSignOut />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();

    const signInButton = screen.getByText("Sign In");
    await act(async () => {
      signInButton.click();
    });

    await waitFor(
      () => {
        expect(screen.getByText("User: testuser")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const signOutButton = screen.getByText("Sign Out");
    await act(async () => {
      signOutButton.click();
    });

    await waitFor(() => {
      expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
    });
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  // Error Handling Tests
  it("should handle sign in error", async () => {
    const TestComponentSignInWithError = () => {
      const { user, loading, signIn } = useAuth();
      const [error, setError] = useState<string | null>(null);

      const handleSignIn = async () => {
        try {
          await signIn("test@test.com", "password");
        } catch (err) {
          setError((err as Error).message);
        }
      };

      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : null}
          {error ? <div>Error: {error}</div> : null}
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      );
    };

    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(amplifySignIn).mockRejectedValue(
      new Error("Incorrect username or password")
    );

    render(
      <AuthProvider>
        <TestComponentSignInWithError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const signInButton = screen.getByText("Sign In");

    await act(async () => {
      signInButton.click();
    });

    // Error should be displayed and user should not be set
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle sign up error", async () => {
    const TestComponentSignUpWithError = () => {
      const { user, loading, signUp } = useAuth();
      const [error, setError] = useState<string | null>(null);

      const handleSignUp = async () => {
        try {
          await signUp("testuser", "test@test.com", "password");
        } catch (err) {
          setError((err as Error).message);
        }
      };

      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : null}
          {error ? <div>Error: {error}</div> : null}
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      );
    };

    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(signUp).mockRejectedValue(
      new Error("An account with the given email already exists")
    );

    render(
      <AuthProvider>
        <TestComponentSignUpWithError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const signUpButton = screen.getByText("Sign Up");

    await act(async () => {
      signUpButton.click();
    });

    // Error should be displayed and user should not be set
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle confirm sign up error", async () => {
    const TestComponentConfirmSignUpWithError = () => {
      const { user, loading, confirmSignUp } = useAuth();
      const [error, setError] = useState<string | null>(null);

      const handleConfirmSignUp = async () => {
        try {
          await confirmSignUp("testuser", "123456");
        } catch (err) {
          setError((err as Error).message);
        }
      };

      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : null}
          {error ? <div>Error: {error}</div> : null}
          <button onClick={handleConfirmSignUp}>Confirm Sign Up</button>
        </div>
      );
    };

    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(confirmSignUp).mockRejectedValue(
      new Error("Invalid verification code provided")
    );

    render(
      <AuthProvider>
        <TestComponentConfirmSignUpWithError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const confirmSignUpButton = screen.getByText("Confirm Sign Up");

    await act(async () => {
      confirmSignUpButton.click();
    });

    // Error should be displayed and user should not be set
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle resend confirmation code error", async () => {
    const TestComponentResendWithError = () => {
      const { user, loading, resendConfirmationCode } = useAuth();
      const [error, setError] = useState<string | null>(null);

      const handleResend = async () => {
        try {
          await resendConfirmationCode("testuser");
        } catch (err) {
          setError((err as Error).message);
        }
      };

      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : null}
          {error ? <div>Error: {error}</div> : null}
          <button onClick={handleResend}>Resend Confirmation Code</button>
        </div>
      );
    };

    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    vi.mocked(resendSignUpCode).mockRejectedValue(new Error("User not found"));

    render(
      <AuthProvider>
        <TestComponentResendWithError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const resendButton = screen.getByText("Resend Confirmation Code");

    await act(async () => {
      resendButton.click();
    });

    // Error should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/User:/)).not.toBeInTheDocument();
  });

  it("should handle sign out error", async () => {
    const TestComponentSignOutWithError = () => {
      const { user, loading, signOut } = useAuth();
      const [error, setError] = useState<string | null>(null);

      const handleSignOut = async () => {
        try {
          await signOut();
        } catch (err) {
          setError((err as Error).message);
        }
      };

      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : null}
          {error ? <div>Error: {error}</div> : null}
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      );
    };

    // User is already signed in
    vi.mocked(getCurrentUser).mockResolvedValue({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    vi.mocked(signOut).mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponentSignOutWithError />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });

    const signOutButton = screen.getByText("Sign Out");

    await act(async () => {
      signOutButton.click();
    });

    // Error should be displayed and user should still be present
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    expect(screen.getByText("User: testuser")).toBeInTheDocument();
  });

  // useAuth Hook Error Test
  it("should throw error when useAuth is used outside AuthProvider", () => {
    const TestComponentWithoutProvider = () => {
      useAuth(); // This should throw
      return <div>Test</div>;
    };

    // Suppress console.error for this specific test
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    console.error = consoleError;
  });

  // Manual checkAuth Test
  it("should manually trigger checkAuth successfully", async () => {
    const TestComponentCheckAuth = () => {
      const { user, loading, checkAuth } = useAuth();
      return (
        <div>
          {loading ? <div>Loading...</div> : null}
          {user ? <div>User: {user.username}</div> : <div>No user</div>}
          <button onClick={checkAuth}>Check Auth</button>
        </div>
      );
    };

    // Initial check fails
    vi.mocked(getCurrentUser).mockRejectedValueOnce(
      new Error("Not authenticated")
    );

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponentCheckAuth />
        </AuthProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("No user")).toBeInTheDocument();
    });

    // Now mock successful auth check
    vi.mocked(getCurrentUser).mockResolvedValue({
      username: "testuser",
      userId: "123",
    });

    vi.mocked(fetchAuthSession).mockResolvedValue({
      tokens: {
        idToken: {
          payload: { email: "test@example.com" },
        },
      },
    } as any);

    const checkAuthButton = screen.getByText("Check Auth");

    await act(async () => {
      checkAuthButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText("User: testuser")).toBeInTheDocument();
    });
  });
});
