import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import { ClientProvider } from './Contexts/ClientContext';
import AppRoutes from './Routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ClientProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ClientProvider>
    </AuthProvider>
  );
}
