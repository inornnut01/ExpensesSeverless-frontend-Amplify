import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto my-4 px-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between sm:grid sm:grid-cols-2 sm:items-center sm:gap-4 md:hidden">
          {/* Logo Section */}
          <div className="sm:col-span-1">
            <div className="flex flex-row items-center gap-2">
              <img
                src="https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-expense-tracker-app-rgb-color-icon-account-symbol-thin-vector-png-image_38870842.png"
                className="size-16"
                alt="Expense Tracker Logo"
              />
              <Link
                to="/"
                className="text-4xl font-bold hover:opacity-80 transition-opacity"
              >
                Expen<span className="text-red-500">se</span>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sm:col-span-1 sm:flex sm:justify-end sm:items-center sm:gap-4">
            {user ? (
              <div className="flex flex-row items-center gap-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-800 text-white hover:bg-green-900"
                  variant="default"
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => navigate("/signup-form")}
                >
                  Sign up
                </Button>
                <Button onClick={() => navigate("/signin-form")}>Login</Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-4">
          {/* Logo Section */}
          <div className="md:col-span-6">
            <div className="flex flex-row items-center gap-2">
              <img
                src="https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-expense-tracker-app-rgb-color-icon-account-symbol-thin-vector-png-image_38870842.png"
                className="size-20"
                alt="Expense Tracker Logo"
              />
              <Link
                to="/"
                className="text-4xl font-bold hover:opacity-80 transition-opacity"
              >
                Expen<span className="text-red-500">se</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 md:flex md:justify-center md:items-center md:gap-8">
            <div className="hover:text-gray-500 cursor-pointer transition-colors">
              Features
            </div>
            <div className="hover:text-gray-500 cursor-pointer transition-colors">
              Pricing
            </div>
            <div className="hover:text-gray-500 cursor-pointer transition-colors">
              FAQs
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-4 md:flex md:justify-end md:items-center md:gap-4">
            {user ? (
              <div className="flex flex-row items-center gap-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-800 text-white hover:bg-green-900"
                  variant="default"
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => navigate("/signup-form")}
                >
                  Sign up
                </Button>
                <Button onClick={() => navigate("/signin-form")}>Login</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
