import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const variants: Record<string, string> = {
  primary: 'bg-ink-800 text-white hover:bg-ink-900 disabled:bg-ink-200',
  secondary: 'bg-white text-ink-800 border border-ink-100 hover:bg-ink-50',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-50',
  danger: 'bg-coral text-white hover:bg-coral/90',
}

const sizes: Record<string, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-sm px-4 py-2.5 rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
