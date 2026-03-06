import { useEffect, useState } from "react";
import { useClient } from "../Contexts/ClientContext";
import { Plus, Search, Trash2 } from "lucide-react";
import Navbar from "../Components/NavBar";
import AddClientForm from "../Components/AddClientForm";
import { useNavigate } from "react-router-dom";
import ClientCard from "../Components/ClientCard";
import SkeletonCard from "../Components/SkeletonCard";

export default function Dashboard() {
  const {
    clients,
    fetchClients,
    loading,
    pageIndex,
    pageSize,
    getTotalStockValueByClientId,
    deleteClient,
  } = useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const navigate = useNavigate();
  const [stockValues, setStockValues] = useState<{
    [clientId: number]: number;
  }>({});
  const [stockLoading, setStockLoading] = useState(true);
  const isLoadingAll = loading || stockLoading;

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
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

  const openAddClientModal = () => setIsAddClientOpen(true);
  const closeAddClientModal = () => setIsAddClientOpen(false);

  const handleViewClient = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      navigate(`/cliente/${clientId}`, { state: { clientName: client.name } });
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    await deleteClient(clientId);
  };

  return (
    <>
      <Navbar
        actionButton={
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white"
            onClick={() => navigate("/trash")}
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">Lixeira</span>
          </button>
        }
        onActionClick={() => navigate("/trash")}
      />
      <main className="min-h-screen bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Clientes
            </h1>
            <button
              onClick={openAddClientModal}
              title="Adicionar Cliente"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={20} strokeWidth={2.5} />
              Adicionar cliente
            </button>
          </div>

          {isAddClientOpen && <AddClientForm onClose={closeAddClientModal} />}

          <div className="relative max-w-sm mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          {isLoadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onView={handleViewClient}
                    onDelete={handleDeleteClient}
                  />
                ))}

                {filteredClients.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-700 text-slate-500">
                    <p className="text-center font-medium">Nenhum cliente encontrado.</p>
                    <p className="text-sm mt-1">Adicione um cliente ou ajuste a busca.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
