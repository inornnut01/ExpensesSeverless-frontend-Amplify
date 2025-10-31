import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";

import SignInForm from "./pages/SignInForm";
import SignUpForm from "./pages/SignUpForm";
import ConfirmSignUpForm from "./pages/ConfirmSignUpForm";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin-form" element={<SignInForm />} />
        <Route path="/signup-form" element={<SignUpForm />} />
        <Route path="/confirm-signup" element={<ConfirmSignUpForm />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
