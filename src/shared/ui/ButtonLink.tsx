import { Link, type LinkProps } from 'react-router-dom'

/** A router link styled like the text button. */
export function ButtonLink({ className = '', ...props }: LinkProps) {
  return (
    <Link
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-primary hover:bg-primary/8 ${className}`}
      {...props}
    />
  )
}
