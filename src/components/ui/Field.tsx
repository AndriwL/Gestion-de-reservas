import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseClasses =
  'w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-800 placeholder:text-ink-300 focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-colors disabled:bg-ink-50 disabled:text-ink-300'

interface WrapperProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

export function FieldWrapper({ label, htmlFor, required, error, hint, children }: WrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-ink-400">{hint}</span>}
      {error && <span className="text-xs text-coral">{error}</span>}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({ label, error, hint, id, required, className = '', ...props }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} required={required} error={error} hint={hint}>
      <input id={id} required={required} className={`${baseClasses} ${className}`} {...props} />
    </FieldWrapper>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function TextAreaField({ label, error, hint, id, required, className = '', ...props }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} required={required} error={error} hint={hint}>
      <textarea id={id} required={required} rows={3} className={`${baseClasses} resize-none ${className}`} {...props} />
    </FieldWrapper>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({
  label,
  error,
  hint,
  id,
  required,
  options,
  placeholder,
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} required={required} error={error} hint={hint}>
      <select id={id} required={required} className={`${baseClasses} ${className}`} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}
