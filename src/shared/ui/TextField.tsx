import type { ComponentProps, ReactNode, Ref, TextareaHTMLAttributes } from 'react'
import { ErrorFilledIcon } from './icons'

type TextFieldProps = {
  id: string
  label: string
  /** Translated error message; also switches the field into its error style. */
  error?: string
  /** Right-aligned helper content below the field, e.g. a character counter. */
  counter?: ReactNode
  multiline?: boolean
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
} & Omit<ComponentProps<'input'>, 'ref' | 'id'>

/** Material 3 outlined text field with a floating label (input or textarea). */
export function TextField({
  id,
  label,
  error,
  counter,
  multiline = false,
  required,
  ref,
  className = '',
  ...props
}: TextFieldProps) {
  const supportId = `${id}-support`
  const control = `peer block w-full rounded border bg-transparent p-4 text-base leading-6 text-on-surface placeholder-transparent outline-none focus:p-[15px] focus:border-2 ${
    error
      ? 'border-error pr-12 focus:border-error'
      : 'border-outline hover:border-on-surface focus:border-primary'
  } ${className}`
  const shared = {
    id,
    placeholder: ' ',
    required,
    'aria-required': required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': supportId,
  }

  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea
            {...shared}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as Ref<HTMLTextAreaElement>}
            rows={4}
            className={`${control} min-h-30 resize-y`}
          />
        ) : (
          <input
            {...shared}
            {...props}
            ref={ref as Ref<HTMLInputElement>}
            className={`${control} h-14`}
          />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute top-4 left-3 bg-surface px-1 text-base leading-6 transition-[top,font-size,line-height] duration-150 peer-focus:-top-2 peer-focus:text-xs peer-focus:leading-4 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:leading-4 ${
            error ? 'text-error' : 'text-on-surface-variant peer-focus:text-primary'
          }`}
        >
          {label}
          {required && '*'}
        </label>
        {error && <ErrorFilledIcon className="absolute top-4 right-3 text-error" />}
      </div>
      <div
        id={supportId}
        className="flex min-h-5 justify-between gap-4 px-4 pt-1 text-xs leading-4"
      >
        <span className="text-error">{error}</span>
        {counter}
      </div>
    </div>
  )
}
