export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Carregando...</p>
    </div>
  );
}
