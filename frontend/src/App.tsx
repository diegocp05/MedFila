import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Checkin } from './pages/Checkin';
import { Dashboard } from './pages/Dashboard';
import { TvPanel } from './pages/TvPanel';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ConsultationRoom } from './pages/ConsultationRoom';
import { History } from './pages/History';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Checkin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tv" element={<TvPanel />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/consultation/:id" element={<ConsultationRoom />} />
              <Route path="/history" element={<History />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
