import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import PrivateRoute from '../Components/PrivateRoute';
import LoginPage from '../Pages/LoginPage';
import ClientPage from '../Pages/ClientPage';
import Dashboard from '../Pages/Dashboard';
import TrashPage from '../Pages/TrashPage';
import Loading from '../Components/Loading';

export default function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-surface-950">
        <Loading />
      </main>
    );
  }

  return (
    <div className="bg-surface-950 min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/cliente/:clientId" element={<ClientPage />} />
          {/* outras rotas privadas */}
        </Route>
      </Routes>
    </div>
  );
}
