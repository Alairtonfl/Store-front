type CardProps = {
  title: string;
  description?: string;
  onClick?: () => void;
  footerActions?: React.ReactNode;
};

const Card = ({ title, description, onClick, footerActions }: CardProps) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className="card-base p-5 hover:shadow-card-hover hover:border-slate-600/70 transition-all duration-200 cursor-pointer group"
    >
      <h5 className="mb-1.5 text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
        {title}
      </h5>
      {description && (
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      )}

      {footerActions && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2 flex-wrap">
          {footerActions}
        </div>
      )}
    </div>
  );
};

export default Card;
