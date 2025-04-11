
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WeeklyScheduler from "@/components/WeeklyScheduler";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-scheduler-primary">Trailer Scheduler</h1>
          
          <div className="flex items-center">
            {/* User info */}
            <div className="mr-4 hidden md:block">
              <span className="text-sm text-gray-600">
                Logged in as <span className="font-semibold">{user?.username}</span>
              </span>
            </div>
            
            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex mr-4"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign out
            </Button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-2 px-4 py-2 bg-white">
            <div className="py-2 px-3 text-sm text-gray-600">
              Logged in as <span className="font-semibold">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-3 text-left text-gray-600 hover:bg-gray-100 rounded-md flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-12rem)]">
          <WeeklyScheduler />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Trailer Scheduler. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
