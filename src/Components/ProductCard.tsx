import { Package, Calendar, DollarSign, Layers, Trash2, Plus } from "lucide-react";

export interface ProductCardProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  creationDate: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  onIncreaseQuantity?: (productId: number) => void;
  onRemove?: (productId: number) => void;
  isDeleted?: boolean;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ProductCard({
  product,
  onIncreaseQuantity,
  onRemove,
  isDeleted = false,
}: ProductCardProps) {
  return (
    <article className="card-base p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start gap-2 min-w-0 justify-between">
        <div className="flex items-start gap-2 min-w-0">
          <Package className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" strokeWidth={2} />
          <h3 className="text-lg font-semibold text-white truncate" title={product.name}>
            {product.name}
          </h3>
        </div>
        {!isDeleted && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onIncreaseQuantity?.(product.id)}
              className="p-2 rounded-lg bg-accent/15 text-accent-400 hover:bg-accent/25 hover:text-accent-300 transition-colors"
              title="Aumentar quantidade"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => onRemove?.(product.id)}
              className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-colors"
              title="Remover produto"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-slate-300">
          <DollarSign className="w-4 h-4 text-accent-400 shrink-0" strokeWidth={2} />
          <div className="min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Valor</p>
            <p className="font-semibold text-white tabular-nums">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Layers className="w-4 h-4 text-accent-400 shrink-0" strokeWidth={2} />
          <div className="min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Quantidade</p>
            <p className="font-semibold text-white tabular-nums">{product.stock}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-300 sm:col-span-1">
          <Calendar className="w-4 h-4 text-accent-400 shrink-0" strokeWidth={2} />
          <div className="min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Data</p>
            <p className="font-medium text-white text-sm">{formatDate(product.creationDate)}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto" />
    </article>
  );
}
