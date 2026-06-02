export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-slate-500">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
