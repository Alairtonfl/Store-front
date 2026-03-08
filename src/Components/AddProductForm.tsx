import { useState } from 'react';
import { useProduct } from '../Contexts/ProductContext';
import { X, Save } from 'lucide-react';

interface AddProductFormProps {
  clientId: number;
  onClose: () => void;
}

export default function AddProductForm({ clientId, onClose }: AddProductFormProps) {
  const { createProduct } = useProduct();
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedStock = Number(stock);
    const parsedPrice = Number(price);

    if (name.trim().length <= 4) {
      setError('O nome deve ter mais de 4 caracteres.');
      return;
    }

    if (isNaN(parsedStock) || parsedStock <= 0) {
      setError('O estoque deve ser maior que zero.');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('O preço deve ser maior que zero.');
      return;
    }

    setLoading(true);
    try {
      const newProduct = await createProduct(clientId, name, parsedStock, parsedPrice);
      if (newProduct) {
        onClose();
      } else {
        setError('Erro ao criar produto.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="card-base w-full max-w-md p-6 relative animate-slide-up shadow-card-hover max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          disabled={loading}
          aria-label="Fechar"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4 pr-8">Adicionar Produto</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="product-name" className="block mb-2 text-sm font-medium text-slate-300">
              Nome do produto
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="product-stock" className="block mb-2 text-sm font-medium text-slate-300">
              Estoque
            </label>
            <input
              id="product-stock"
              type="number"
              placeholder="Estoque"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input-field"
              min={0}
            />
          </div>

          <div>
            <label htmlFor="product-price" className="block mb-2 text-sm font-medium text-slate-300">
              Preço
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              min={0}
              step="0.01"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex items-center gap-2 text-sm"
            disabled={loading}
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 text-sm"
            disabled={loading}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-surface-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
