import { BrowserRouter } from 'react-router-dom';
import { ErrorProvider } from './Contexts/ErrorContext';
import { AuthProvider } from './Contexts/AuthContext';
import { ClientProvider } from './Contexts/ClientContext';
import { ProductProvider } from './Contexts/ProductContext';
import AppRoutes from './Routes/AppRoutes';

export default function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <ClientProvider>
          <ProductProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ProductProvider>
        </ClientProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}
