import { useEffect, useState } from 'react';
import { useClient } from '../Contexts/ClientContext';
import { Eye, Plus } from 'lucide-react';
import Navbar from '../Components/NavBar';
import AddClientForm from '../Components/AddClientForm';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import SkeletonCard from '../Components/SkeletonCard';

export default function Dashboard() {
  const { clients, fetchClients, loading, pageIndex, pageSize, getTotalStockValueByClientId } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const navigate = useNavigate();
  const [stockValues, setStockValues] = useState<{ [clientId: number]: number }>({});
  const [stockLoading, setStockLoading] = useState(true);
  const isLoadingAll = loading || stockLoading;


  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchStockValues = async () => {
      setStockLoading(true);
      const promises = filteredClients.map(async (client) => {
        try {
          const total = await getTotalStockValueByClientId(client.id);
          return { id: client.id, total };
        } catch {
          return { id: client.id, total: 0 };
        }
      });

      const results = await Promise.all(promises);

      const values: { [id: number]: number } = {};
      results.forEach(({ id, total }) => {
        values[id] = total;
      });

      setStockValues(values);
      setStockLoading(false);
    };

    if (filteredClients.length > 0) {
      fetchStockValues();
    } else {
      setStockValues({});
      setStockLoading(false);
    }
  }, [clients, getTotalStockValueByClientId]);

  const handleNextPage = () => {
    fetchClients(pageIndex + 1, pageSize);
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) fetchClients(pageIndex - 1, pageSize);
  };

  const openAddClientModal = () => setIsAddClientOpen(true);
  const closeAddClientModal = () => setIsAddClientOpen(false);

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto text-white bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <button
            onClick={openAddClientModal}
            title="Adicionar Cliente"
            className="bg-blue-700 hover:bg-blue-800 p-2 rounded flex items-center justify-center"
          >
            <Plus size={24} className="text-white hover:text-gray-300 transition-colors" />
          </button>
        </div>

        {isAddClientOpen && (
          <AddClientForm onClose={closeAddClientModal} />
        )}

        {/* Filtro */}
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 px-4 py-2 border border-slate-600 rounded w-full max-w-sm bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
        />

        {isLoadingAll ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Cards de Clientes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <Card
                  key={client.id}
                  title={client.name}
                  description={`Valor: R$ ${stockValues[client.id] !== undefined
                    ? stockValues[client.id].toFixed(2)
                    : 'carregando...'
                    }`}
                  onClick={() => navigate(`/cliente/${client.id}`, { state: { clientName: client.name } })}
                />
              ))}

              {filteredClients.length === 0 && (
                <div className="col-span-full text-center text-gray-400 p-4">
                  Nenhum cliente encontrado.
                </div>
              )}
            </div>

            {/* Paginação */}
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
                disabled={clients.length < pageSize || loading}
                className="bg-slate-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-slate-600"
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );

}
