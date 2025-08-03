type CardProps = {
  title: string;
  description?: string;
  onClick?: () => void;
};

const Card = ({ title, description, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer block w-full p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-sm hover:bg-slate-700 transition"
    >
      <h5 className="mb-1 text-xl font-semibold text-white">{title}</h5>
      {description && (
        <p className="text-sm text-gray-300">
          {description}
        </p>
      )}
    </div>
  );
};

export default Card;
