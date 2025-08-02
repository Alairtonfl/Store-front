import { useEffect, useState } from 'react';
import { useClient } from '../Contexts/ClientContext';
import { Eye, Plus } from 'lucide-react';
import Navbar from '../Components/NavBar';
import AddClientForm from '../Components/AddClientForm';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

export default function Dashboard() {
  const { clients, fetchClients, loading, pageIndex, pageSize } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const navigate = useNavigate(); // Inicializar

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Filtro */}
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 px-4 py-2 border border-slate-600 rounded w-full max-w-sm bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
        />

        {/* Tabela */}
        <div className="overflow-x-auto bg-slate-800 shadow-md rounded-lg">
          <table className="table-auto w-full">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} className="border-t border-slate-700 hover:bg-slate-700">
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2 flex justify-center items-center">
                    <button
                      className="text-blue-400 hover:text-blue-500"
                      onClick={() => navigate(`/cliente/${client.id}`, { state: { clientName: client.name } })} // redireciona
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-gray-400 px-4 py-4">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      </main>
    </>
  );
}
