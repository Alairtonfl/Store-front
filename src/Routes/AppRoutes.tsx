import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import PrivateRoute from '../Components/PrivateRoute';
import LoginPage from '../Pages/LoginPage';
import ClientPage from '../Pages/ClientPage';
import Dashboard from '../Pages/Dashboard';
import Loading from '../Components/Loading';

export default function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-slate-900">
        <Loading />
      </main>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cliente/:clientId" element={<ClientPage />} />
          {/* outras rotas privadas */}
        </Route>
      </Routes>
    </div>
  );
}
