import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { USER_ROLES } from '../constants/roles';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Loader from '../components/common/Loader';
/* ─── Layouts ─── */
import AuthLayout from '../layouts/AuthLayout';

/* ─── Lazy-loaded pages ─── */
// Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const OAuthCallbackPage = lazy(() => import('../pages/auth/OAuthCallbackPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Error
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));
const ServerErrorPage = lazy(() => import('../pages/error/ServerErrorPage'));

// Citizen pages
const CitizenDashboardPage = lazy(() => import('../pages/citizen/CitizenDashboardPage'));
const CitizenProfilePage = lazy(() => import('../pages/citizen/CitizenProfilePage'));
const CreateReportPage = lazy(() => import('../pages/citizen/CreateReportPage'));
const MyReportsPage = lazy(() => import('../pages/citizen/MyReportsPage'));
const ReportDetailsPage = lazy(() => import('../pages/citizen/ReportDetailsPage'));
const CreateEmergencyPage = lazy(() => import('../pages/citizen/CreateEmergencyPage'));
const MyEmergenciesPage = lazy(() => import('../pages/citizen/MyEmergenciesPage'));
const NearbyReportsPage = lazy(() => import('../pages/citizen/NearbyReportsPage'));

// Officer pages
const SelectDepartmentPage = lazy(() => import('../pages/officer/SelectDepartmentPage'));
const OfficerDashboardPage = lazy(() => import('../pages/officer/OfficerDashboardPage'));
const OfficerReportsPage = lazy(() => import('../pages/officer/OfficerReportsPage'));
const OfficerReportDetailsPage = lazy(() => import('../pages/officer/OfficerReportDetailsPage'));
const OfficerEmergenciesPage = lazy(() => import('../pages/officer/OfficerEmergenciesPage'));
const StatisticsPage = lazy(() => import('../pages/officer/StatisticsPage'));
const OfficerProfilePage = lazy(() => import('../pages/officer/OfficerProfilePage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const DepartmentManagementPage = lazy(() => import('../pages/admin/DepartmentManagementPage'));
const OfficerManagementPage = lazy(() => import('../pages/admin/OfficerManagementPage'));
const ReportsAuditPage = lazy(() => import('../pages/admin/ReportsAuditPage'));
const AdminReportDetailsPage = lazy(() => import('../pages/admin/AdminReportDetailsPage'));
const EmergencyOversightPage = lazy(() => import('../pages/admin/EmergencyOversightPage'));

// Public pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));

/* ─── Layouts ─── */
import CitizenLayout from '../layouts/CitizenLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AdminLayout from '../layouts/AdminLayout';

/* ─── Loading fallback ─── */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader />
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ─── Public routes ─── */}
          <Route path="/" element={<LandingPage />} />

          {/* ─── Auth routes ─── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth-success" element={<OAuthCallbackPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* ─── Error routes ─── */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/error" element={<ServerErrorPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* ─── Citizen routes ─── */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={USER_ROLES.CITIZEN} />
              </ProtectedRoute>
            }
          >
            <Route element={<CitizenLayout />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
              <Route path="/citizen/profile" element={<CitizenProfilePage />} />
              <Route path="/citizen/reports" element={<MyReportsPage />} />
              <Route path="/citizen/reports/create" element={<CreateReportPage />} />
              <Route path="/citizen/reports/:id" element={<ReportDetailsPage />} />
              <Route path="/citizen/emergencies" element={<MyEmergenciesPage />} />
              <Route path="/citizen/emergencies/create" element={<CreateEmergencyPage />} />
              <Route path="/citizen/nearby" element={<NearbyReportsPage />} />
            </Route>
          </Route>

          {/* ─── Officer routes ─── */}
          {/* Department selection (must be first, no layout) */}
          <Route
            path="/officer/select-department"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={USER_ROLES.OFFICER} />
              </ProtectedRoute>
            }
          >
            <Route index element={<SelectDepartmentPage />} />
          </Route>

          {/* Officer dashboard routes (require department selection) */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={USER_ROLES.OFFICER} />
              </ProtectedRoute>
            }
          >
            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
              <Route path="/officer/reports" element={<OfficerReportsPage />} />
              <Route path="/officer/reports/:id" element={<OfficerReportDetailsPage />} />
              <Route path="/officer/emergencies" element={<OfficerEmergenciesPage />} />
              <Route path="/officer/statistics" element={<StatisticsPage />} />
              <Route path="/officer/profile" element={<OfficerProfilePage />} />
            </Route>
          </Route>

          {/* ─── Admin routes ─── */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={USER_ROLES.ADMIN} />
              </ProtectedRoute>
            }
          > 
            <Route element={<AdminLayout />}>           
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/departments" element={<DepartmentManagementPage />} />
              <Route path="/admin/officers" element={<OfficerManagementPage />} />
              <Route path="/admin/reports" element={<ReportsAuditPage />} />
              <Route path="/admin/reports/:id" element={<AdminReportDetailsPage />} />
              <Route path="/admin/emergencies" element={<EmergencyOversightPage />} />
            </Route>
          </Route>

          {/* ─── Catch-all 404 ─── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;