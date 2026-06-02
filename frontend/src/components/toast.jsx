export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  const colors =
    type === "error"
      ? "bg-red-50 text-red-800 border-red-200"
      : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border px-4 py-3 shadow-lg ${colors}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-lg leading-none opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
