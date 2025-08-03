export default function SkeletonCard() {
  return (
    <div className="h-32 bg-slate-700 rounded-xl animate-pulse p-4 flex flex-col justify-between">
      <div className="h-4 bg-slate-600 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-600 rounded w-1/3"></div>
    </div>
  );
}
