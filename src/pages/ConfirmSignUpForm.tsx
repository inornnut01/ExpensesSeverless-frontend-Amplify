import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";

function ConfirmSignUpForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendConfirmationCode } = useAuth();

  // Get username from navigation state
  const username = location.state?.username || "";

  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  // Redirect if no username provided
  useEffect(() => {
    if (!username) {
      navigate("/signup-form");
    }
  }, [username, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (confirmationCode.length !== 6) {
      setError("Please enter a 6-digit confirmation code");
      return;
    }

    setLoading(true);

    try {
      // Confirm the signup
      await confirmSignUp(username, confirmationCode);
      setSuccess(true);

      // Redirect to signin page after successful confirmation
      setTimeout(() => navigate("/signin-form"), 2000);
    } catch (err: any) {
      console.error("Confirmation error:", err);

      // Handle different error types
      if (err.name === "CodeMismatchException") {
        setError("Invalid confirmation code. Please check and try again.");
      } else if (err.name === "ExpiredCodeException") {
        setError("Confirmation code has expired. Please request a new code.");
      } else if (err.name === "LimitExceededException") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to confirm account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setResendMessage("");
    setResendLoading(true);

    try {
      await resendConfirmationCode(username);
      setResendMessage("Verification code sent! Please check your email.");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error("Resend code error:", err);
      setError(err.message || "Failed to resend confirmation code");
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your account has been successfully verified.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to sign in page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            Expen<span className="text-blue-600">se</span>
          </h1>
          <p className="text-gray-600">Verify your email</p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Enter Confirmation Code
            </h2>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit confirmation code to your email. Please enter
              it below to verify your account.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Username: <span className="font-medium">{username}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {resendMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="confirmationCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmation Code
              </label>
              <input
                id="confirmationCode"
                type="text"
                value={confirmationCode}
                onChange={(e) =>
                  setConfirmationCode(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify Account"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={resendLoading || resendCooldown > 0}
                className="w-full"
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend Code (${resendCooldown}s)`
                  : "Resend Code"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUpForm;
