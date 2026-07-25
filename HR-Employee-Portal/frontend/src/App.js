import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/common/AppLayout';
import HomePage from './components/home/HomePage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import HRDashboard from './components/dashboard/EnhancedHRDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeProfile from './components/employees/EnhancedEmployeeProfile';
import EmployeeForm from './components/employees/EmployeeForm';
import AttendanceTracker from './components/attendance/AttendanceTracker';
import LeaveRequest from './components/leave/LeaveRequest';
import LeaveManagement from './components/leave/LeaveManagement';
import PayrollManagement from './components/payroll/PayrollManagement';
import Payslip from './components/payroll/EnhancedPayslip';
import PerformanceReview from './components/performance/PerformanceReview';
import PerformanceTracking from './components/performance/PerformanceTracking';
import Settings from './components/common/Settings';
import Notifications from './components/notifications/AdvancedNotifications';
import Help from './components/common/Help';
import ComprehensiveReports from './components/reports/ComprehensiveReports';
import './styles/glassmorphism.css';
import './styles/enhanced-global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Role-Based Dynamic Dashboard Routing */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            {user?.role === 'hr' ? <HRDashboard initialTab="overview" /> : 
             user?.role === 'manager' ? <ManagerDashboard /> : 
             <EmployeeDashboard />}
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['hr']}>
          <AppLayout>
            <HRDashboard initialTab="analytics" />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['hr', 'manager']}>
          <AppLayout>
            <ComprehensiveReports />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/employees" element={
        <ProtectedRoute allowedRoles={['hr', 'manager']}>
          <AppLayout>
            <EmployeeList />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/employees/new" element={
        <ProtectedRoute allowedRoles={['hr']}>
          <AppLayout>
            <EmployeeForm />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/employees/edit/:id" element={
        <ProtectedRoute allowedRoles={['hr']}>
          <AppLayout>
            <EmployeeForm />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <EmployeeProfile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/attendance" element={
        <ProtectedRoute>
          <AppLayout>
            <AttendanceTracker />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/leave" element={
        <ProtectedRoute>
          <AppLayout>
            {user?.role === 'employee' ? <LeaveRequest /> : <LeaveManagement />}
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/payroll" element={
        <ProtectedRoute allowedRoles={['hr', 'manager']}>
          <AppLayout>
            <PayrollManagement />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/payslips" element={
        <ProtectedRoute>
          <AppLayout>
            <Payslip />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/performance" element={
        <ProtectedRoute>
          <AppLayout>
            <PerformanceReview />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/performance/new" element={
        <ProtectedRoute allowedRoles={['hr', 'manager']}>
          <AppLayout>
            <PerformanceTracking />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/performance/review/:id" element={
        <ProtectedRoute allowedRoles={['hr', 'manager']}>
          <AppLayout>
            <PerformanceTracking />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <AppLayout>
            <Notifications />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/help" element={
        <ProtectedRoute>
          <AppLayout>
            <Help />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
          <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <div className="App">
                <AppRoutes />
              </div>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;