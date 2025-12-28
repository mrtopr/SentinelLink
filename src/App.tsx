import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Incidents from './pages/Incidents';
import ReportIncident from './pages/ReportIncident';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MapView from './pages/MapView';
import EmergencyAlert from './components/EmergencyAlert';
import ScrollToTop from './components/ScrollToTop';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <>
      <ScrollToTop />
      <EmergencyAlert />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
