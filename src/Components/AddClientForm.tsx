import { useState } from 'react';
import { useClient } from '../Contexts/ClientContext';
import Loading from './Loading';

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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // fecha modal ao clicar fora do formulário
    >
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md text-white"
        onClick={e => e.stopPropagation()} // impede fechar ao clicar dentro do form
      >
        <h2 className="text-xl font-bold mb-4">Adicionar Cliente</h2>

        <input
          type="text"
          placeholder="Nome do cliente"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            disabled={loading}
          >
            {loading && <Loading />}
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
