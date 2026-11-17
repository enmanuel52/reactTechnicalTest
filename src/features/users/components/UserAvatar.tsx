import { avatarColor } from '../utils/avatarColor'
import { getInitials } from '../utils/getInitials'

interface UserAvatarProps {
  id: number
  name: string
  /** Pixel size of the circle. */
  size?: number
}

/** Decorative: the user's name is always rendered next to it. */
export function UserAvatar({ id, name, size = 40 }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-[#161D1D]"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(id),
        fontSize: size >= 56 ? 20 : 16,
      }}
    >
      {getInitials(name)}
    </span>
  )
}
