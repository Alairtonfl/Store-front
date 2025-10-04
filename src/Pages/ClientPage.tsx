import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../Contexts/ProductContext";
import Navbar from "../Components/NavBar";
import { ArrowLeft, Plus } from "lucide-react";
import Card from "../Components/Card";
import AddProductForm from "../Components/AddProductForm";

export default function ClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const location = useLocation();
  const clientName =
    (location.state as { clientName?: string })?.clientName || "Cliente";
  const navigate = useNavigate();
  const {
    products,
    fetchProductsByClientIdPaged,
    loading,
    pageIndex,
    pageSize,
  } = useProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchProductsByClientIdPaged(Number(clientId));
    }
  }, [clientId]);

  const filteredProducts = products.filter((product) =>
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
      <Navbar
        actionButton={
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
        }
        onActionClick={() => navigate("/")}
      />
      <main className="p-6 max-w-7xl mx-auto text-white bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="text-white hover:text-gray-400"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">{clientName}</h1>
          </div>

          <button
            title="Adicionar Produto"
            className="bg-blue-700 hover:bg-blue-800 p-2 rounded flex items-center justify-center"
            onClick={() => setShowForm(true)}
          >
            <Plus
              size={24}
              className="text-white hover:text-gray-300 transition-colors"
            />
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 px-4 py-2 border border-slate-600 rounded w-full max-w-sm bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              title={product.name}
              description={`Valor: R$ ${product.price.toFixed(
                2
              )} - Qauntidade: ${product.stock}`}
            />
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-400 px-4 py-4">
              Nenhum produto encontrado.
            </p>
          )}
        </div>

        {/* <div className="flex justify-between items-center mt-4">
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
        </div> */}
      </main>

      {showForm && clientId && (
        <AddProductForm
          clientId={Number(clientId)}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
