import { User, Trash2, Calendar } from "lucide-react";

export interface ClientCardClient {
  id: number;
  name: string;
  deletionDate?: string;
}

interface ClientCardProps {
  client: ClientCardClient;
  isDeleted?: boolean;
  onView?: (clientId: number) => void;
  onDelete?: (clientId: number) => void;
  onRestore?: (clientId: number) => void;
}

export default function ClientCard({
  client,
  isDeleted = false,
  onView,
  onDelete,
  onRestore,
}: ClientCardProps) {
  const handleCardClick = () => {
    if (!isDeleted) onView?.(client.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(client.id);
  };

  const isClickable = !isDeleted && onView;

  return (
    <article
      onClick={isClickable ? handleCardClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? "0" : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onView?.(client.id);
              }
            }
          : undefined
      }
      className={`card-base p-4 sm:p-5 flex flex-col gap-4 transition-all duration-200 ${
        isClickable
          ? "cursor-pointer group hover:shadow-card-hover hover:border-slate-600/70"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex items-start gap-2 min-w-0">
          <User
            className="w-5 h-5 text-accent-400 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <h3
            className={`text-lg font-semibold text-white truncate transition-colors ${
              isClickable ? "group-hover:text-accent-400" : ""
            }`}
            title={client.name}
          >
            {client.name}
          </h3>
        </div>
        {!isDeleted && onDelete ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-colors"
            title="Deletar cliente"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        ) : isDeleted && client.deletionDate ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Excluído em</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {new Date(client.deletionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
