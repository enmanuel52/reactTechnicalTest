import { useT } from '@/shared/i18n/useT'
import type { PostView } from '../types'

export function PostItem({ post }: { post: PostView }) {
  const t = useT()
  return (
    <li className="border-b border-outline-variant py-4">
      <article className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base leading-6 font-medium">{post.title}</h4>
          {post.isNew && (
            <span className="rounded-lg bg-tertiary-container px-2 py-0.5 text-[11px] leading-4 font-medium tracking-[0.5px] text-on-tertiary-container">
              {t.newBadge}
            </span>
          )}
        </div>
        <p className="whitespace-pre-line text-on-surface-variant">{post.body}</p>
      </article>
    </li>
  )
}
