import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './shared/context/AppContext';
import { DataProvider } from './shared/context/DataContext';
import { AuthProvider } from './shared/context/AuthContext';
import { GlobalDataProvider } from './shared/context/GlobalDataContext';
// ── Shared Components ──────────────────────────────────────────────────────────
import ProtectedRoute from './shared/components/ProtectedRoute';
import GuestRoute from './shared/components/GuestRoute';

// ── Features ───────────────────────────────────────────────────────────────────
// Landing & Choice
import Landing from './features/landing/Landing';
import Choice from './features/choice/Choice';

// Auth
import ChildLogin from './features/auth/ChildLogin';
import ParentLogin from './features/auth/ParentLogin';
import DoctorLogin from './features/auth/DoctorLogin';

// Child
import ChildHome from './features/child-home/ChildHome';
import Pecs from './features/pecs/Pecs';
import Routine from './features/routine/Routine';
import Emotions from './features/emotions/Emotions';
import Calming from './features/calming/Calming';
import Profile from './features/profile/Profile';

// Games
import GamesHub from './features/games-hub/GamesHub';
import Puzzle from './features/puzzle/Puzzle';
import WordGame from './features/word-builder/WordGame';
import ArtStudio from './features/art-studio/ArtStudio';
import Piano from './features/piano/Piano';

// Parent
import Dashboard from './features/parent-dashboard/Dashboard';
import ParentProfile from './features/parent-dashboard/ParentProfile';

import DoctorDashboard from './features/doctor-dashboard/DoctorDashboard';
import DoctorProfile from './features/doctor-dashboard/DoctorProfile';

// Misc
import Settings from './features/settings/Settings';
import NotFound from './features/not-found/NotFound';

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
              <Route path="/" element={<Landing />} />
              <Route path="/choice" element={<Choice />} />

              {/* ===== صفحات تسجيل دخول الطفل (للضيوف فقط) ===== */}
              <Route path="/child-login" element={
                <GuestRoute role="child">
                  <ChildLogin />
                </GuestRoute>
              } />
              <Route path="/child-signup" element={
                <GuestRoute role="child">
                  <ChildLogin initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول ولي الأمر (للضيوف فقط) ===== */}
              <Route path="/parent-login" element={
                <GuestRoute role="parent">
                  <ParentLogin />
                </GuestRoute>
              } />
              <Route path="/parent-signup" element={
                <GuestRoute role="parent">
                  <ParentLogin initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات تسجيل دخول الدكتور (للضيوف فقط) ===== */}
              <Route path="/doctor-login" element={
                <GuestRoute role="doctor">
                  <DoctorLogin />
                </GuestRoute>
              } />
              <Route path="/doctor-signup" element={
                <GuestRoute role="doctor">
                  <DoctorLogin initialIsLogin={false} />
                </GuestRoute>
              } />

              {/* ===== صفحات الطفل (محمية) ===== */}
              <Route path="/child-home" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <ChildHome />
                </ProtectedRoute>
              } />
              <Route path="/pecs" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Pecs />
                </ProtectedRoute>
              } />
              <Route path="/emotions" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Emotions />
                </ProtectedRoute>
              } />
              <Route path="/routine" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Routine />
                </ProtectedRoute>
              } />
              <Route path="/calming" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Calming />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Profile />
                </ProtectedRoute>
              } />

              {/* ===== ألعاب الطفل (محمية) ===== */}
              <Route path="/games" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <GamesHub />
                </ProtectedRoute>
              } />
              <Route path="/games/puzzle" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Puzzle />
                </ProtectedRoute>
              } />
              <Route path="/games/words" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <WordGame />
                </ProtectedRoute>
              } />
              <Route path="/games/drawing" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <ArtStudio />
                </ProtectedRoute>
              } />
              <Route path="/games/piano" element={
                <ProtectedRoute role="child" redirectTo="/child-login">
                  <Piano />
                </ProtectedRoute>
              } />

              {/* ===== صفحات ولي الأمر (محمية) ===== */}
              <Route path="/parent-dashboard/profile" element={<ProtectedRoute role="parent" redirectTo="/parent-login"><ParentProfile /></ProtectedRoute>} />
              <Route path="/parent-dashboard/:tab?" element={<ProtectedRoute role="parent" redirectTo="/parent-login"><Dashboard /></ProtectedRoute>} />

              {/* ===== صفحات الدكتور (محمية) ===== */}
              <Route path="/doctor-dashboard/profile" element={<ProtectedRoute role="doctor" redirectTo="/doctor-login"><DoctorProfile /></ProtectedRoute>} />
              <Route path="/doctor-dashboard/:tab?" element={<ProtectedRoute role="doctor" redirectTo="/doctor-login"><DoctorDashboard /></ProtectedRoute>} />

              <Route path="/settings" element={<Settings />} />

              {/* ===== صفحة 404 ===== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </DataProvider>
          </AuthProvider>
        </GlobalDataProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
