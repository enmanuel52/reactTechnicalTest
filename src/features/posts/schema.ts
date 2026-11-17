import { z } from 'zod'

export const TITLE_MAX_LENGTH = 100

/**
 * Validation for the new-post form. Messages are dictionary keys, translated
 * by the form, so the schema stays independent of the active language.
 */
export const postSchema = z.object({
  title: z.string().trim().min(1, 'titleRequired').max(TITLE_MAX_LENGTH, 'titleTooLong'),
  body: z.string().trim().min(1, 'bodyRequired'),
})

export type PostFormValues = z.input<typeof postSchema>
export type PostInput = z.output<typeof postSchema>
export type PostErrorKey = 'titleRequired' | 'titleTooLong' | 'bodyRequired'
