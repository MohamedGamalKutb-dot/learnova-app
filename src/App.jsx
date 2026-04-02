import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import LandingPage from './pages/LandingPage';
import ChoicePage from './pages/ChoicePage';
import ChildHomePage from './pages/ChildHomePage';
import ChildLoginPage from './pages/ChildLoginPage';
import ChildSignupPage from './pages/ChildSignupPage';
import PecsPage from './pages/PecsPage';
import EmotionsPage from './pages/EmotionsPage';
import RoutinePage from './pages/RoutinePage';
import CalmingPage from './pages/CalmingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DoctorAuthPage from './pages/DoctorAuthPage';
import DoctorPage from './pages/DoctorPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* ===== صفحات عامة ===== */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/choice" element={<ChoicePage />} />

              {/* ===== صفحات تسجيل دخول الطفل (للضيوف فقط - لو مسجل دخول يروح child-home) ===== */}
              <Route path="/child-login" element={
                <GuestRoute role="child">
                  <ChildLoginPage />
                </GuestRoute>
              } />
              <Route path="/child-signup" element={
                <GuestRoute role="child">
                  <ChildSignupPage />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول ولي الأمر (للضيوف فقط - لو مسجل دخول يروح dashboard) ===== */}
              <Route path="/login" element={
                <GuestRoute role="parent">
                  <LoginPage />
                </GuestRoute>
              } />
              <Route path="/signup" element={
                <GuestRoute role="parent">
                  <SignupPage />
                </GuestRoute>
              } />

              {/* ===== صفحة تسجيل دخول الدكتور (للضيوف فقط - لو مسجل دخول يروح doctor-dashboard) ===== */}
              <Route path="/doctor-auth" element={
                <GuestRoute role="doctor">
                  <DoctorAuthPage />
                </GuestRoute>
              } />

              {/* ===== صفحات الطفل (محمية - لازم يكون الطفل مسجل دخول) ===== */}
              <Route path="/child-home" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <ChildHomePage />
                </ProtectedRoute>
              } />
              <Route path="/pecs" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <PecsPage />
                </ProtectedRoute>
              } />
              <Route path="/emotions" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <EmotionsPage />
                </ProtectedRoute>
              } />
              <Route path="/routine" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <RoutinePage />
                </ProtectedRoute>
              } />
              <Route path="/calming" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <CalmingPage />
                </ProtectedRoute>
              } />

              {/* ===== صفحات ولي الأمر (محمية - لازم يكون ولي الأمر مسجل دخول) ===== */}
              <Route path="/dashboard" element={
                <ProtectedRoute role="parent" redirectTo="/login">
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute role="parent" redirectTo="/login">
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* ===== صفحات الدكتور (محمية - لازم يكون الدكتور مسجل دخول) ===== */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute role="doctor" redirectTo="/doctor-auth">
                  <DoctorPage />
                </ProtectedRoute>
              } />

              {/* ===== صفحة 404 ===== */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
