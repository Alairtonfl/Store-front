import { useState } from 'react';
import { useClient } from '../Contexts/ClientContext';
import { X, Save } from 'lucide-react';

interface AddClientFormProps {
  onClose: () => void;
}

export default function AddClientForm({ onClose }: AddClientFormProps) {
  const { createClient } = useClient();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length <= 4) {
      setError('O nome deve ter mais de 4 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const newClient = await createClient({ name: name.trim() });
      if (newClient) {
        onClose();
      } else {
        setError('Erro ao criar cliente.');
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
        className="card-base w-full max-w-md p-6 relative animate-slide-up shadow-card-hover"
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

        <h2 className="text-xl font-bold text-white mb-4 pr-8">Adicionar Cliente</h2>

        <label htmlFor="client-name" className="block mb-2 text-sm font-medium text-slate-300">
          Nome do cliente
        </label>
        <input
          id="client-name"
          type="text"
          placeholder="Nome do cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field mb-2"
        />
        {error && (
          <p className="text-red-400 text-sm mt-1 mb-2">{error}</p>
        )}

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
