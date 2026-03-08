import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../Contexts/ProductContext";
import { useClient } from "../Contexts/ClientContext";
import Navbar from "../Components/NavBar";
import { ArrowLeft, Plus, Search } from "lucide-react";
import ProductCard from "../Components/ProductCard";
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
    pageIndex,
    pageSize,
    updateProduct,
    deleteProduct,
  } = useProduct();
  const { getTotalStockValueByClientId, payClientAccount } = useClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [totalOwed, setTotalOwed] = useState<number | null>(null);

  const handleIncreaseQuantity = async (productId: number) => {
    if (!clientId) return;
    try {
      await updateProduct(productId);
      getTotalStockValueByClientId(Number(clientId)).then(setTotalOwed).catch(() => setTotalOwed(0));
    } catch {

    }
  };

  const handleRemoveProduct = async (productId: number) => {
    if (!clientId) return;
    try {
      await deleteProduct(productId);
      getTotalStockValueByClientId(Number(clientId)).then(setTotalOwed).catch(() => setTotalOwed(0));
    } catch {

    }
  };

  const handlePayAll = async () => {
    if (!clientId) return;
    try {
      const success = await payClientAccount(Number(clientId));
      if (success) {
        navigate("/");
      }
    } catch {
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchProductsByClientIdPaged(Number(clientId));
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      getTotalStockValueByClientId(Number(clientId))
        .then(setTotalOwed)
        .catch(() => setTotalOwed(0));
    } else {
      setTotalOwed(null);
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
          <button
            type="button"
            className="flex items-center gap-2 text-slate-300 hover:text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        }
        onActionClick={() => navigate("/")}
      />
      <main className="min-h-screen bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                  title="Voltar"
                >
                  <ArrowLeft size={20} strokeWidth={2} />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {clientName}
                </h1>
              </div>
              {totalOwed !== null && (
                <p className="text-slate-400 text-sm pl-14">
                  Total a receber:{" "}
                  <span className="font-semibold text-amber-400">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalOwed)}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                title="Pagar tudo"
                onClick={handlePayAll}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-sm font-medium transition-colors"
              >
                Pagar tudo
              </button>
              <button
                title="Adicionar Produto"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} strokeWidth={2.5} />
                Adicionar produto
              </button>
            </div>
          </div>

          <div className="relative max-w-sm mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onIncreaseQuantity={handleIncreaseQuantity}
                onRemove={handleRemoveProduct}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-700 text-slate-500">
                <p className="text-center font-medium">Nenhum produto encontrado.</p>
                <p className="text-sm mt-1">Adicione um produto ou ajuste a busca.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showForm && clientId && (
        <AddProductForm
          clientId={Number(clientId)}
          onClose={async () => {
            setShowForm(false);
            if (clientId) {
              try {
                const total = await getTotalStockValueByClientId(Number(clientId));
                setTotalOwed(total);
              } catch {
                setTotalOwed(0);
              }
            }
          }}
        />
      )}
    </>
  );
}
