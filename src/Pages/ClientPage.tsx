import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProduct } from '../Contexts/ProductContext';
import Navbar from '../Components/NavBar';
import { ArrowLeft } from 'lucide-react';

export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();
  const clientName = (location.state as { clientName?: string })?.clientName || 'Cliente';
  const navigate = useNavigate();
  const {
    products,
    fetchProductsByClientIdPaged,
    loading,
    pageIndex,
    pageSize,
  } = useProduct();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchProductsByClientIdPaged(Number(clientId));
    }
  }, [clientId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    fetchProductsByClientIdPaged(Number(clientId), pageIndex + 1, pageSize);
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      fetchProductsByClientIdPaged(Number(clientId), pageIndex - 1, pageSize);
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto text-white bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="text-white hover:text-gray-400">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">{clientName}</h1>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 px-4 py-2 border border-slate-600 rounded w-full max-w-sm bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
        />

        <div className="overflow-x-auto bg-slate-800 shadow-md rounded-lg">
          <table className="table-auto w-full">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Estoque</th>
                <th className="px-4 py-2 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-t border-slate-700 hover:bg-slate-700">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">R$ {product.value.toFixed(2)}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 px-4 py-4">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={pageIndex === 0 || loading}
            className="bg-slate-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-slate-600"
          >
            Anterior
          </button>
          <span className="text-gray-300">Página {pageIndex + 1}</span>
          <button
            onClick={handleNextPage}
            disabled={products.length < pageSize || loading}
            className="bg-slate-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-slate-600"
          >
            Próximo
          </button>
        </div>
      </main>
    </>
  );
}
