import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Amplify } from "aws-amplify";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_s0FfrMv7V",
      userPoolClientId: "1e2kc6nf8b8dca0vkmjqg0k5u2",
    },
  },
});

interface User {
  username: string;
  email?: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setUser({
        username: currentUser.username,
        email: session.tokens?.idToken?.payload.email as string,
        userId: currentUser.userId,
      });
    } catch (error) {
      console.error("Check auth error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    try {
      await signIn({ username, password });
      await checkAuth();
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const handleSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
