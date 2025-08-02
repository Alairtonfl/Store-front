import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* futuras rotas: dashboard, perfil, etc */}
      </Routes>
    </Router>
  );
}
