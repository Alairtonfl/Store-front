import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import Loading from './Loading';

export default function PrivateRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading){
      return (
      <main className="flex justify-center items-center min-h-screen bg-slate-900">
          <Loading />
      </main>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}