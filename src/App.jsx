import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Contexts/AuthContext';
import { ClientProvider } from './Contexts/ClientContext';
import { useContext } from 'react';
import PrivateRoute from './Components/PrivateRoute';
import LoginPage from './Pages/LoginPage';
import ClientPage from './Pages/ClientPage';
import Dashboard from './Pages/Dashboard';
import Loading from './Components/Loading';

function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) {
return (
    <main className="flex justify-center items-center min-h-screen bg-slate-900">
      <Loading />
    </main>
  );
  }

  return (
    <div className='bg-slate-900'>
      
    <ClientProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cliente/:clientId" element={<ClientPage />} />
          {/* outras rotas privadas */}
        </Route>
      </Routes>
    </ClientProvider>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
