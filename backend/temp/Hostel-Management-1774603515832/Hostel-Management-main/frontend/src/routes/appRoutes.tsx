// src/routes/AppRoutes.tsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ----------------------
// Admin Pages & Layout
// ----------------------
import AdminLayout from '../layouts/adminlayout';
import Dashboard from '../pages/admin/dashboard';
import Students from '../pages/admin/student';
import Fees from '../pages/admin/fees';
import Mess from '../pages/admin/mess';
import Complaints from '../pages/admin/complaint';
import { AdminLogin } from '../pages/admin/login';

// ----------------------
// Student Pages & Layout
// ----------------------
import LaunchingPage from '../pages/landing/home';
import { StudentPortal } from '../pages/student/studentportal';
import StudentLayout from '../layouts/studentlayout';   
import { OverviewTab } from '../pages/student/overviewTab';
import { Login as StudentLogin } from '../pages/student/login';
import { NewAdmission } from '../pages/student/newadmission';
import { AdmissionContinuation } from '../pages/student/newadmissioncontinuation';
import StudentFees from '../pages/student/fees';
import { StudentMess } from '../pages/student/mess';
import { StudentComplaints } from '../pages/student/complaints';

// ----------------------
// Protected Route
// ----------------------
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectPath?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, redirectPath = '/' }) => {
  if (!isAuthenticated) return <Navigate to={redirectPath} replace />;
  return <>{children}</>;
};

// ----------------------
// App Routes
// ----------------------
const AppRoutes: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isStudentAuthenticated, setIsStudentAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ----------------------
  // Auth handlers
  // ----------------------
  const handleAdminLogin = () => setIsAdminAuthenticated(true);
  const handleStudentLogin = () => setIsStudentAuthenticated(true);
  const handleAdminLogout = () => { setIsAdminAuthenticated(false); navigate('/'); };
  const handleStudentLogout = () => { setIsStudentAuthenticated(false); navigate('/student/login'); };
  const handlePageChange = (target: 'admin' | 'student') => {
    if (target === 'admin') navigate('/login');
    if (target === 'student') navigate('/student/login');
  };

  // Wrappers
  const AdminLoginWrapper: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const loginSuccess = () => { onLogin(); navigate('/admin/dashboard'); };
    return <AdminLogin onLogin={loginSuccess} onPageChange={() => navigate('/')} />;
  };

  const StudentLoginWrapper: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const loginSuccess = () => { onLogin(); navigate('/student/dashboard'); };
    return <StudentLogin onLogin={loginSuccess} />;
  };

  const NewAdmissionWrapper: React.FC = () => {
    const handleAdmissionComplete = () => navigate('/student/admission-continue');
    return <NewAdmission onPageChange={handleAdmissionComplete} />;
  };

  const AdmissionContinuationWrapper: React.FC = () => {
    const handleAdmissionComplete = () => navigate('/student/login');
    return <AdmissionContinuation onComplete={handleAdmissionComplete} />;
  };

  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<LaunchingPage onPageChange={handlePageChange} />} />

      {/* ----------------------
          Student Routes
      ---------------------- */}
      <Route path="/student" element={<StudentPortal />}>
        <Route
          path="login"
          element={
            isStudentAuthenticated ? 
              <Navigate to="/student/dashboard" replace /> : 
              <StudentLoginWrapper onLogin={handleStudentLogin} />
          }
        />
        <Route path="new-admission" element={<NewAdmissionWrapper />} />
      </Route>

      {/* Admission continuation route */}
      <Route path="/student/admission-continue" element={<AdmissionContinuationWrapper />} />

      {/* Student protected routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isStudentAuthenticated} redirectPath="/student/login">
            <StudentLayout pageTitle="Dashboard" onLogout={handleStudentLogout}>
              <OverviewTab />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/fees"
        element={
          <ProtectedRoute isAuthenticated={isStudentAuthenticated} redirectPath="/student/login">
            <StudentLayout pageTitle="Fee Details" onLogout={handleStudentLogout}>
              <StudentFees />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/mess"
        element={
          <ProtectedRoute isAuthenticated={isStudentAuthenticated} redirectPath="/student/login">
            <StudentLayout pageTitle="Mess Details" onLogout={handleStudentLogout}>
              <StudentMess />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/complaints"
        element={
          <ProtectedRoute isAuthenticated={isStudentAuthenticated} redirectPath="/student/login">
            <StudentLayout pageTitle="Complaints" onLogout={handleStudentLogout}>
              <StudentComplaints />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* ----------------------
          Admin Routes
      ---------------------- */}
      <Route
        path="/login"
        element={
          isAdminAuthenticated ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <AdminLoginWrapper onLogin={handleAdminLogin} />
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout pageTitle="Dashboard" onLogout={handleAdminLogout}>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout pageTitle="Students Management" onLogout={handleAdminLogout}>
              <Students />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/fees"
        element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout pageTitle="Fees Management" onLogout={handleAdminLogout}>
              <Fees />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/mess"
        element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout pageTitle="Mess Management" onLogout={handleAdminLogout}>
              <Mess />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout pageTitle="Complaints" onLogout={handleAdminLogout}>
              <Complaints />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
