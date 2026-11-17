import { useLocation, useParams } from 'react-router-dom'
import { NewPostForm } from '@/features/posts/components/NewPostForm'
import { PostsSection } from '@/features/posts/components/PostsSection'
import { HttpError } from '@/shared/api/http'
import { useT } from '@/shared/i18n/useT'
import { ButtonLink } from '@/shared/ui/ButtonLink'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { ArrowBackIcon } from '@/shared/ui/icons'
import { LoadingState } from '@/shared/ui/LoadingState'
import { useUser } from '../hooks/useUser'
import { UserHeader } from './UserHeader'

function UserNotFound() {
  const t = useT()
  const { search } = useLocation()
  return (
    <EmptyState title={t.userNotFoundTitle} body={t.userNotFoundBody}>
      <ButtonLink to={{ pathname: '/', search }} className="mt-4">
        {t.backToUsers}
      </ButtonLink>
    </EmptyState>
  )
}

function UserDetail({ userId }: { userId: number }) {
  const t = useT()
  const { search } = useLocation()
  const { data: user, isPending, error, refetch } = useUser(userId)

  if (isPending) return <LoadingState label={t.loadingUsers} className="p-4" />

  if (error) {
    if (error instanceof HttpError && error.status === 404) return <UserNotFound />
    return (
      <ErrorState
        title={t.usersErrorTitle}
        body={t.errorBody}
        retryLabel={t.retry}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* The list pane is hidden on small screens, so offer a way back. */}
      <ButtonLink to={{ pathname: '/', search }} className="-ml-1 self-start md:hidden">
        <ArrowBackIcon size={20} />
        {t.backToUsers}
      </ButtonLink>
      <UserHeader user={user} />
      <NewPostForm userId={user.id} />
      <div className="h-px bg-outline-variant" />
      <PostsSection userId={user.id} />
    </div>
  )
}

export function UserDetailPage() {
  const { userId } = useParams()
  const id = Number(userId)

  if (!Number.isInteger(id) || id < 1) return <UserNotFound />

  // Keyed by id so switching users never carries state over (e.g. a half-written post).
  return <UserDetail key={id} userId={id} />
}
