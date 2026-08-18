import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './shared/context/AppContext';
import { DataProvider } from './shared/context/DataContext';
import { AuthProvider } from './shared/context/AuthContext';
import { GlobalDataProvider } from './shared/context/GlobalDataContext';

// ── Constants ──────────────────────────────────────────────────────────────────
import { ROUTES } from '@/constants/routes';

// ── Shared Components ──────────────────────────────────────────────────────────
import ProtectedRoute from './shared/components/ProtectedRoute';
import GuestRoute from './shared/components/GuestRoute';
import LoadingState from './components/common/LoadingState';

// ── Features (Lazy Loaded) ─────────────────────────────────────────────────────
const Landing = lazy(() => import('./features/landing/Landing'));
const Choice = lazy(() => import('./features/choice/Choice'));

const ChildLogin = lazy(() => import('./features/auth/ChildLogin'));
const ParentLogin = lazy(() => import('./features/auth/ParentLogin'));
const DoctorLogin = lazy(() => import('./features/auth/DoctorLogin'));

const ChildHome = lazy(() => import('./features/child-home/ChildHome'));
const Pecs = lazy(() => import('./features/pecs/Pecs'));
const Routine = lazy(() => import('./features/routine/Routine'));
const Emotions = lazy(() => import('./features/emotions/Emotions'));

const Profile = lazy(() => import('./features/profile/Profile'));

const GamesHub = lazy(() => import('./features/games-hub/GamesHub'));
const Puzzle = lazy(() => import('./features/puzzle/Puzzle'));
const WordGame = lazy(() => import('./features/word-builder/WordGame'));
const ArtStudio = lazy(() => import('./features/art-studio/ArtStudio'));
const Piano = lazy(() => import('./features/piano/Piano'));

const Dashboard = lazy(() => import('./features/parent-dashboard/Dashboard'));
const ParentProfile = lazy(() => import('./features/parent-dashboard/ParentProfile'));

const DoctorDashboard = lazy(() => import('./features/doctor-dashboard/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./features/doctor-dashboard/DoctorProfile'));

const Settings = lazy(() => import('./features/settings/Settings'));
const NotFound = lazy(() => import('./features/not-found/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <GlobalDataProvider>
          <AuthProvider>
            <DataProvider>
              <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { fontFamily: 'inherit' } }} />
              <Suspense fallback={<div className="h-screen flex items-center justify-center"><LoadingState label="Loading..." /></div>}>
                <Routes>
                  {/* ===== Public Pages ===== */}
                  <Route path={ROUTES.HOME} element={<Landing />} />
                  <Route path={ROUTES.CHOICE} element={<Choice />} />

                  {/* ===== Child Auth ===== */}
                  <Route path={ROUTES.CHILD_LOGIN} element={<GuestRoute role="child"><ChildLogin /></GuestRoute>} />
                  <Route path={ROUTES.CHILD_SIGNUP} element={<GuestRoute role="child"><ChildLogin initialIsLogin={false} /></GuestRoute>} />

                  {/* ===== Parent Auth ===== */}
                  <Route path={ROUTES.PARENT_LOGIN} element={<GuestRoute role="parent"><ParentLogin /></GuestRoute>} />
                  <Route path={ROUTES.PARENT_SIGNUP} element={<GuestRoute role="parent"><ParentLogin initialIsLogin={false} /></GuestRoute>} />

                  {/* ===== Doctor Auth ===== */}
                  <Route path={ROUTES.DOCTOR_LOGIN} element={<GuestRoute role="doctor"><DoctorLogin /></GuestRoute>} />
                  <Route path={ROUTES.DOCTOR_SIGNUP} element={<GuestRoute role="doctor"><DoctorLogin initialIsLogin={false} /></GuestRoute>} />

                  {/* ===== Child Features ===== */}
                  <Route path={ROUTES.CHILD_HOME} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><ChildHome /></ProtectedRoute>} />
                  <Route path={ROUTES.PECS} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Pecs /></ProtectedRoute>} />
                  <Route path={ROUTES.EMOTIONS} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Emotions /></ProtectedRoute>} />
                  <Route path={ROUTES.ROUTINE} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Routine /></ProtectedRoute>} />

                  <Route path={ROUTES.PROFILE} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Profile /></ProtectedRoute>} />

                  {/* ===== Games ===== */}
                  <Route path={ROUTES.GAMES} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><GamesHub /></ProtectedRoute>} />
                  <Route path={ROUTES.GAMES_PUZZLE} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Puzzle /></ProtectedRoute>} />
                  <Route path={ROUTES.GAMES_WORDS} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><WordGame /></ProtectedRoute>} />
                  <Route path={ROUTES.GAMES_DRAWING} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><ArtStudio /></ProtectedRoute>} />
                  <Route path={ROUTES.GAMES_PIANO} element={<ProtectedRoute role="child" redirectTo={ROUTES.CHILD_LOGIN}><Piano /></ProtectedRoute>} />

                  {/* ===== Parent Features ===== */}
                  <Route path={ROUTES.PARENT_PROFILE} element={<ProtectedRoute role="parent" redirectTo={ROUTES.PARENT_LOGIN}><ParentProfile /></ProtectedRoute>} />
                  <Route path={`${ROUTES.PARENT_DASHBOARD}/:tab?`} element={<ProtectedRoute role="parent" redirectTo={ROUTES.PARENT_LOGIN}><Dashboard /></ProtectedRoute>} />

                  {/* ===== Doctor Features ===== */}
                  <Route path={ROUTES.DOCTOR_PROFILE} element={<ProtectedRoute role="doctor" redirectTo={ROUTES.DOCTOR_LOGIN}><DoctorProfile /></ProtectedRoute>} />
                  <Route path={`${ROUTES.DOCTOR_DASHBOARD}/:tab?`} element={<ProtectedRoute role="doctor" redirectTo={ROUTES.DOCTOR_LOGIN}><DoctorDashboard /></ProtectedRoute>} />

                  {/* ===== Misc ===== */}
                  <Route path={ROUTES.SETTINGS} element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </DataProvider>
          </AuthProvider>
        </GlobalDataProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
