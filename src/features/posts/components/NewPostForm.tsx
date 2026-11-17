import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import type { Dictionary } from '@/shared/i18n/en'
import { useT } from '@/shared/i18n/useT'
import { useToastStore } from '@/shared/store/toast'
import { Button } from '@/shared/ui/Button'
import { SpinnerIcon } from '@/shared/ui/icons'
import { TextField } from '@/shared/ui/TextField'
import { useCreatePost } from '../hooks/useCreatePost'
import {
  postSchema,
  TITLE_MAX_LENGTH,
  type PostErrorKey,
  type PostFormValues,
  type PostInput,
} from '../schema'

function translate(t: Dictionary, message: string | undefined) {
  // Schema messages are dictionary keys (see schema.ts).
  return message ? t[message as PostErrorKey] : undefined
}

export function NewPostForm({ userId }: { userId: number }) {
  const t = useT()
  const showToast = useToastStore((s) => s.show)
  const { mutate, isPending, isError } = useCreatePost(userId)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PostFormValues, unknown, PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', body: '' },
  })
  const titleLength = useWatch({ control, name: 'title' }).length

  const onSubmit = (values: PostInput) =>
    mutate(values, {
      onSuccess: () => {
        reset()
        showToast(t.postPublished)
      },
    })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="new-post-heading"
      className="flex flex-col gap-1"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h3 id="new-post-heading" className="text-base leading-6 font-medium">
          {t.newPost}
        </h3>
        <span className="text-xs text-on-surface-variant">{t.requiredNote}</span>
      </div>

      <TextField
        id="post-title"
        label={t.titleLabel}
        required
        autoComplete="off"
        error={translate(t, errors.title?.message)}
        counter={
          <span
            className={titleLength > TITLE_MAX_LENGTH ? 'text-error' : 'text-on-surface-variant'}
          >
            {titleLength}/{TITLE_MAX_LENGTH}
          </span>
        }
        {...register('title')}
      />
      <div className="mt-3" />
      <TextField
        id="post-body"
        label={t.bodyLabel}
        required
        multiline
        error={translate(t, errors.body?.message)}
        {...register('body')}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <p className="min-w-60 flex-1 text-xs leading-4 text-on-surface-variant">{t.demoNote}</p>
        <Button type="submit" disabled={isPending}>
          {isPending && <SpinnerIcon size={18} className="animate-spin" />}
          {isPending ? t.publishing : t.publish}
        </Button>
      </div>
      {isError && (
        <p role="alert" className="mt-2 text-error">
          {t.publishError}
        </p>
      )}
    </form>
  )
}
