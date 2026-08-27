import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Checkin } from './pages/Checkin';
import { Dashboard } from './pages/Dashboard';
import { TvPanel } from './pages/TvPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Checkin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tv" element={<TvPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
