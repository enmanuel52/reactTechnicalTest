import type { ButtonHTMLAttributes } from 'react'

type Variant = 'filled' | 'outlined' | 'text'

const VARIANTS: Record<Variant, string> = {
  filled:
    'bg-primary px-6 text-on-primary hover:shadow-[inset_0_0_0_40px_color-mix(in_srgb,var(--md-on-primary)_8%,transparent)] disabled:cursor-progress disabled:bg-on-surface/12 disabled:text-on-surface/38 disabled:shadow-none',
  outlined: 'border border-outline px-6 text-primary hover:bg-primary/8',
  text: 'px-3 text-primary hover:bg-primary/8',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'filled', type = 'button', className = '', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`relative inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium tracking-[0.1px] before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
