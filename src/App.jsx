import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import { ClientProvider } from './Contexts/ClientContext';
import { ProductProvider } from './Contexts/ProductContext'; // importar provider
import AppRoutes from './Routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ClientProvider>
        <ProductProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ProductProvider>
      </ClientProvider>
    </AuthProvider>
  );
}
