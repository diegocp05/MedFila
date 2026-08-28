import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Checkin } from './pages/Checkin';
import { Dashboard } from './pages/Dashboard';
import { TvPanel } from './pages/TvPanel';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Checkin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tv" element={<TvPanel />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
