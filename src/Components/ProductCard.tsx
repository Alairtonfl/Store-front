import { Package, Calendar, DollarSign, Layers } from "lucide-react";

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
}: ProductCardProps) {
  return (
    <article className="card-base p-4 sm:p-5 flex flex-col gap-4">
      {/* Nome do produto */}
      <div className="flex items-start gap-2 min-w-0">
        <Package className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" strokeWidth={2} />
        <h3 className="text-lg font-semibold text-white truncate" title={product.name}>
          {product.name}
        </h3>
      </div>

      {/* Valor, quantidade e data em grid responsivo */}
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

      {/* Ações: área de toque generosa no mobile */}
      <div className="mt-auto pt-4 border-t border-slate-700/50 flex gap-2">
        <button
          type="button"
          onClick={() => onIncreaseQuantity?.(product.id)}
          className="flex-1 min-h-[44px] sm:min-h-0 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl bg-accent/20 text-accent-400 hover:bg-accent/30 font-medium text-sm transition-colors active:scale-[0.98]"
          title="Aumentar quantidade"
        >
          <span className="text-lg font-bold">+</span>
          <span>Aumentar</span>
        </button>
        <button
          type="button"
          onClick={() => onRemove?.(product.id)}
          className="flex-1 min-h-[44px] sm:min-h-0 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium text-sm transition-colors active:scale-[0.98]"
          title="Remover produto"
        >
          <span>Remover</span>
        </button>
      </div>
    </article>
  );
}
