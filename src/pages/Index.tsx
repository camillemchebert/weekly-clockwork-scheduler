
import { useState } from "react";
import WeeklyScheduler from "@/components/WeeklyScheduler";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-scheduler-primary">Trailer Scheduler</h1>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-scheduler-primary font-medium">Schedule</a>
            <a href="#" className="text-gray-600 hover:text-scheduler-primary">Calendar</a>
            <a href="#" className="text-gray-600 hover:text-scheduler-primary">About</a>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-2 px-4 py-2 bg-white">
            <a href="#" className="py-2 px-3 bg-scheduler-highlight/20 text-scheduler-primary rounded-md">Schedule</a>
            <a href="#" className="py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-md">Calendar</a>
            <a href="#" className="py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-md">About</a>
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
