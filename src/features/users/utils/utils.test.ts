import { describe, expect, it } from 'vitest'
import { avatarColor } from './avatarColor'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('uses the first letter of the first two words, uppercased', () => {
    expect(getInitials('Leanne Graham')).toBe('LG')
    expect(getInitials('clementine bauch')).toBe('CB')
  })

  it('handles one word, extra spaces and long names', () => {
    expect(getInitials('Madonna')).toBe('M')
    expect(getInitials('  Ervin   Howell ')).toBe('EH')
    expect(getInitials('Nicholas Runolfsdottir V')).toBe('NR')
  })
})

describe('avatarColor', () => {
  it('is stable for the same id and always returns a palette colour', () => {
    expect(avatarColor(3)).toBe(avatarColor(3))
    expect(avatarColor(1)).toMatch(/^#[0-9A-F]{6}$/)
  })

  it('cycles through the palette', () => {
    expect(avatarColor(1)).toBe(avatarColor(6))
    expect(avatarColor(1)).not.toBe(avatarColor(2))
  })
})
