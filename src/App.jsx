import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalDataProvider } from './context/GlobalDataContext';
// ── Shared Components ──────────────────────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import GuestRoute from './components/GuestRoute/GuestRoute';

// ── Pages ──────────────────────────────────────────────────────────────────────
import LandingPage from './pages/landing/LandingPage';
import ChoicePage from './pages/choice/ChoicePage';

// Auth
import ChildLoginPage from './pages/auth/child-login/ChildLoginPage';
import ParentLoginPage from './pages/auth/parent-login/ParentLoginPage';
import DoctorLoginPage from './pages/auth/doctor-login/DoctorLoginPage';

// Child
import ChildHomePage from './pages/child-home/ChildHomePage';
import PecsPage from './pages/pecs/PecsPage';
import EmotionsPage from './pages/emotions/EmotionsPage';
import RoutinePage from './pages/routine/RoutinePage';
import CalmingPage from './pages/calming/CalmingPage';
import ProfilePage from './pages/profile/ProfilePage';

// Parent
import DashboardPage from './pages/parent-dashboard/DashboardPage';
import ParentProfilePage from './pages/parent-profile/ParentProfilePage';

// Doctor
import DoctorPage from './pages/doctor-dashboard/DoctorPage';
import DoctorProfilePage from './pages/doctor-profile/DoctorProfilePage';

// Misc
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/not-found/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalDataProvider>
          <AuthProvider>
            <DataProvider>
              <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { fontFamily: 'inherit' } }} />
            <Routes>
              {/* ===== صفحات عامة ===== */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/choice" element={<ChoicePage />} />

              {/* ===== صفحات تسجيل دخول الطفل (للضيوف فقط) ===== */}
              <Route path="/child-login" element={
                <GuestRoute role="child">
                  <ChildLoginPage />
                </GuestRoute>
              } />
              <Route path="/child-signup" element={
                <GuestRoute role="child">
                  <ChildLoginPage initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول ولي الأمر (للضيوف فقط) ===== */}
              <Route path="/parent-login" element={
                <GuestRoute role="parent">
                  <ParentLoginPage />
                </GuestRoute>
              } />
              <Route path="/parent-signup" element={
                <GuestRoute role="parent">
                  <ParentLoginPage initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول الدكتور (للضيوف فقط) ===== */}
              <Route path="/doctor-login" element={
                <GuestRoute role="doctor">
                  <DoctorLoginPage />
                </GuestRoute>
              } />
              <Route path="/doctor-signup" element={
                <GuestRoute role="doctor">
                  <DoctorLoginPage initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات الطفل (محمية) ===== */}
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
              <Route path="/profile" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* ===== صفحات ولي الأمر (محمية) ===== */}
              <Route path="/parent-dashboard/:tab?" element={
                <ProtectedRoute role="parent" redirectTo="/parent-login">
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/parent-dashboard/profile" element={
                <ProtectedRoute role="parent" redirectTo="/parent-login">
                  <ParentProfilePage />
                </ProtectedRoute>
              } />

              {/* ===== صفحات الدكتور (محمية) ===== */}
              <Route path="/doctor-dashboard/:tab?" element={
                <ProtectedRoute role="doctor" redirectTo="/doctor-login">
                  <DoctorPage />
                </ProtectedRoute>
              } />
              <Route path="/doctor-dashboard/profile" element={
                <ProtectedRoute role="doctor" redirectTo="/doctor-login">
                  <DoctorProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={<SettingsPage />} />

              {/* ===== صفحة 404 ===== */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </DataProvider>
          </AuthProvider>
        </GlobalDataProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
