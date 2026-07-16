export function Field({
  label,
  value,
  onChange,
  type = 'text',
  as = 'input',
  options,
  required = true,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  as?: 'input' | 'select'
  options?: { value: string; label: string }[]
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {as === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          {options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        />
      )}
    </div>
  )
}
