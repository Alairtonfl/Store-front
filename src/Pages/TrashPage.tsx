import { useEffect, useState } from "react";
import { useClient } from "../Contexts/ClientContext";
import { Search } from "lucide-react";
import Navbar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import ClientCard from "../Components/ClientCard";
import SkeletonCard from "../Components/SkeletonCard";

export default function TrashPage() {
  const {
    deletedClients,
    fetchDeletedClients,
    loadingDeleted,
  } = useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeletedClients();
  }, []);

  const filteredClients = deletedClients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (clientId: number) => {
    const client = deletedClients.find((c) => c.id === clientId);
    navigate(`/trash/cliente/${clientId}`, {
      state: { clientName: client?.name },
    });
  };

  return (
    <>
      <Navbar
        actionButton={
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white"
            onClick={() => navigate("/")}
          >
            <span className="text-sm font-medium">Clientes</span>
          </button>
        }
        onActionClick={() => navigate("/")}
      />
      <main className="min-h-screen bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Lixeira
            </h1>
          </div>

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

          {loadingDeleted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  isDeleted
                  onView={handleViewClient}
                />
              ))}

              {filteredClients.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-700 text-slate-500">
                  <p className="text-center font-medium">Nenhum cliente na lixeira.</p>
                  <p className="text-sm mt-1">Clientes excluídos aparecerão aqui.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
