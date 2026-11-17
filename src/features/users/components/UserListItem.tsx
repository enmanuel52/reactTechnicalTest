import { NavLink } from 'react-router-dom'
import type { User } from '../types'
import { UserAvatar } from './UserAvatar'

export function UserListItem({ user }: { user: User }) {
  return (
    <li>
      <NavLink
        to={`/users/${user.id}`}
        className={({ isActive }) =>
          `flex min-h-18 w-full items-center gap-4 rounded-2xl px-4 py-2 text-left hover:bg-on-surface/8 ${
            isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <UserAvatar id={user.id} name={user.name} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-base leading-6">{user.name}</span>
              <span
                className={`truncate ${isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}
              >
                @{user.username} · {user.address.city}
              </span>
            </span>
          </>
        )}
      </NavLink>
    </li>
  )
}
