import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/choice" element={<ChoicePage />} />
              <Route path="/child-login" element={<ChildLoginPage />} />
              <Route path="/child-signup" element={<ChildSignupPage />} />
              <Route path="/child-home" element={<ChildHomePage />} />
              <Route path="/pecs" element={<PecsPage />} />
              <Route path="/emotions" element={<EmotionsPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/calming" element={<CalmingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/doctor-auth" element={<DoctorAuthPage />} />
              <Route path="/doctor-dashboard" element={<DoctorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
