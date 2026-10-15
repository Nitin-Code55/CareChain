import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientRecords from './pages/patient/PatientRecords';
import PatientUploadRecord from './pages/patient/PatientUploadRecord';
import PatientRecordDetails from './pages/patient/PatientRecordDetails';
import PatientPermissions from './pages/patient/PatientPermissions';
import PatientIntegrityVerify from './pages/patient/PatientIntegrityVerify';
import PatientActivity from './pages/patient/PatientActivity';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorRecords from './pages/doctor/DoctorRecords';
import DoctorRecordDetails from './pages/doctor/DoctorRecordDetails';
import DoctorIntegrityVerify from './pages/doctor/DoctorIntegrityVerify';
import DoctorActivity from './pages/doctor/DoctorActivity';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStats from './pages/admin/AdminStats';
import AdminBlockchain from './pages/admin/AdminBlockchain';
import AdminAudit from './pages/admin/AdminAudit';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Portal Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="records/:id" element={<PatientRecordDetails />} />
          <Route path="upload" element={<PatientUploadRecord />} />
          <Route path="permissions" element={<PatientPermissions />} />
          <Route path="verify" element={<PatientIntegrityVerify />} />
          <Route path="activity" element={<PatientActivity />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor Portal Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="records" element={<DoctorRecords />} />
          <Route path="records/:id" element={<DoctorRecordDetails />} />
          <Route path="verify" element={<DoctorIntegrityVerify />} />
          <Route path="activity" element={<DoctorActivity />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="blockchain" element={<AdminBlockchain />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
