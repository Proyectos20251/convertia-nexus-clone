import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Organization from "@/pages/Organization";
import TimeManagement from "@/pages/TimeManagement";
import Performance from "@/pages/Performance";
import Calendar from "@/pages/Calendar";
import Documents from "@/pages/Documents";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Help from "@/pages/Help";
import InboxPage from "@/pages/InboxPage";
import Objectives from "@/pages/Objectives";
import Training from "@/pages/Training";
import Surveys from "@/pages/Surveys";
import Wellness from "@/pages/Wellness";
import AIAssistantPage from "@/pages/AIAssistantPage";
import Competencies from "@/pages/Competencies";
import PeopleAnalytics from "@/pages/PeopleAnalytics";
import Reports from "@/pages/Reports";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organization"
              element={
                <ProtectedRoute>
                  <Organization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/time-management"
              element={
                <ProtectedRoute>
                  <TimeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <InboxPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/objectives"
              element={
                <ProtectedRoute>
                  <Objectives />
                </ProtectedRoute>
              }
            />
            <Route
              path="/training"
              element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys"
              element={
                <ProtectedRoute>
                  <Surveys />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wellness"
              element={
                <ProtectedRoute>
                  <Wellness />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/competencies"
              element={
                <ProtectedRoute>
                  <Competencies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/people-analytics"
              element={
                <ProtectedRoute>
                  <PeopleAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <ShadcnToaster />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
