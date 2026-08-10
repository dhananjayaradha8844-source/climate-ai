import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Warnings } from './pages/Warnings';
import { Historical } from './pages/Historical';
import { Reports } from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="warnings" element={<Warnings />} />
          <Route path="historical" element={<Historical />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
