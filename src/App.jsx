import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import LandingPage from './pages/LandingPage';
import ChoicePage from './pages/ChoicePage';
import ChildHomePage from './pages/ChildHomePage';
import ChildLoginPage from './pages/ChildLoginPage';
import PecsPage from './pages/PecsPage';
import EmotionsPage from './pages/EmotionsPage';
import RoutinePage from './pages/RoutinePage';
import CalmingPage from './pages/CalmingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ParentLoginPage from './pages/ParentLoginPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorPage from './pages/DoctorPage';
import SettingsPage from './pages/SettingsPage';
import ParentProfilePage from './pages/ParentProfilePage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { fontFamily: 'inherit' } }} />
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
                  <ChildLoginPage initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول ولي الأمر (للضيوف فقط - لو مسجل دخول يروح dashboard) ===== */}
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

              {/* ===== صفحات تسجيل دخول الدكتور (للضيوف فقط - لو مسجل دخول يروح doctor-dashboard) ===== */}
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
              <Route path="/parent-dashboard/:tab?" element={
                <ProtectedRoute role="parent" redirectTo="/parent-login">
                  <DashboardPage />
                </ProtectedRoute>
              } />
               <Route path="/profile" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/parent-dashboard/profile" element={
                <ProtectedRoute role="parent" redirectTo="/parent-login">
                  <ParentProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={<SettingsPage />} />

              {/* ===== صفحات الدكتور (محمية - لازم يكون الدكتور مسجل دخول) ===== */}
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
