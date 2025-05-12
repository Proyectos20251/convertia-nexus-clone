
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Organization from "@/pages/Organization";
import TimeManagement from "@/pages/TimeManagement";
import Performance from "@/pages/Performance";
import Help from "@/pages/Help";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Inbox from "@/pages/Inbox";
import Documents from "@/pages/Documents";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organization" element={<Organization />} />
              <Route path="/time-management" element={<TimeManagement />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/help" element={<Help />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Nuevas rutas implementadas */}
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
