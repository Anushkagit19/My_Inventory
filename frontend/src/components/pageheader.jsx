export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

