import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("aws-amplify/auth", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  fetchAuthSession: vi.fn(),
  confirmSignUp: vi.fn(),
  resendSignUpCode: vi.fn(),
}));

global.fetch = vi.fn();

// Mock ResizeObserver for recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;
