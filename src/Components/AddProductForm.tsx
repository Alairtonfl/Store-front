import { useState } from 'react';
import { useProduct } from '../Contexts/ProductContext';
import Loading from './Loading';
import { X } from 'lucide-react'; // Ícone para fechar

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
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md text-white relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Botão de fechar (X) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    disabled={loading}
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">Adicionar Produto</h2>

                <input
                    type="text"
                    placeholder="Nome do produto"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 mb-3 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="number"
                    placeholder="Estoque"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full px-4 py-2 mb-3 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                />

                <input
                    type="number"
                    placeholder="Preço"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-2 mb-3 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step="0.01"
                />

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <div className="flex justify-end mt-6">
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
