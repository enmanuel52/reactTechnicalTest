const PALETTE = ['#00C2CB', '#7FE0D4', '#FFE38A', '#FF9A76', '#FF5D8F'] as const

/** Stable colour per user id; the palette is light enough for dark initials. */
export function avatarColor(id: number) {
  return PALETTE[Math.abs(id) % PALETTE.length]
}
