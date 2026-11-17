import type { User } from '../types'
import { UserAvatar } from './UserAvatar'

export function UserHeader({ user }: { user: User }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <UserAvatar id={user.id} name={user.name} size={56} />
      <div className="min-w-50 flex-1">
        <h2 className="text-2xl leading-8 font-normal">{user.name}</h2>
        <p className="text-on-surface-variant">
          @{user.username} · {user.company.name} ·{' '}
          <a href={`mailto:${user.email}`} className="text-primary hover:underline">
            {user.email}
          </a>
        </p>
      </div>
    </div>
  )
}
