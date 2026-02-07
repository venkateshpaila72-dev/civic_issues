import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { USER_ROLES } from '../constants/roles';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Loader from '../components/common/Loader';

/* ─── Layouts ─── */
import AuthLayout from '../layouts/AuthLayout';
// Other layouts will come in Phase 3

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

// Public pages (Phase 9)
// const LandingPage = lazy(() => import('../pages/public/LandingPage'));

// Citizen pages (Phase 4)
const CitizenDashboardPage = lazy(() => import('../pages/citizen/CitizenDashboardPage'));
const CitizenProfilePage = lazy(() => import('../pages/citizen/CitizenProfilePage'));

// Citizen pages (Phase 5)
const CreateReportPage = lazy(() => import('../pages/citizen/CreateReportPage'));

// Citizen pages (Phase 6)
const MyReportsPage = lazy(() => import('../pages/citizen/MyReportsPage'));
const ReportDetailsPage = lazy(() => import('../pages/citizen/ReportDetailsPage'));

/* ─── Layouts ─── */
import CitizenLayout from '../layouts/CitizenLayout';

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
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Temporary redirect to login; will change to LandingPage in Phase 9 */}

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

          {/* ─── Citizen routes (Phase 4-6) ─── */}
          <Route element={<ProtectedRoute><RoleBasedRoute allowedRoles={USER_ROLES.CITIZEN}><CitizenLayout /></RoleBasedRoute></ProtectedRoute>}>
            <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
            <Route path="/citizen/profile" element={<CitizenProfilePage />} />
            <Route path="/citizen/reports" element={<MyReportsPage />} />
            <Route path="/citizen/reports/create" element={<CreateReportPage />} />
            <Route path="/citizen/reports/:id" element={<ReportDetailsPage />} />
            {/* Phase 6: Emergencies and nearby reports will be added next */}
          </Route>

          {/* ─── Officer routes (Phase 7) ─── */}
          {/* Will be added in Phase 7 */}

          {/* ─── Admin routes (Phase 8) ─── */}
          {/* Will be added in Phase 8 */}

          {/* ─── Catch-all 404 ─── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;