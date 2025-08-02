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
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nome do cliente"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
        {loading && <Loading />}
        {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
