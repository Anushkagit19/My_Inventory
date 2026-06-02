export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  step,
  min,
  max,
  required,
  disabled,
  error,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        step={step}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-slate-300 focus:border-slate-500"
        } disabled:bg-slate-100 disabled:text-slate-400`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
