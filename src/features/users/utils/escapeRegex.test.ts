import { describe, expect, it } from 'vitest'
import { escapeRegex } from './escapeRegex'

describe('escapeRegex', () => {
  it('leaves plain names untouched', () => {
    expect(escapeRegex('Leanne Graham')).toBe('Leanne Graham')
  })

  it('escapes every regex metacharacter', () => {
    expect(escapeRegex('a.b*c+d?e^f$g{h}i(j)k|l[m]n\\o')).toBe(
      'a\\.b\\*c\\+d\\?e\\^f\\$g\\{h\\}i\\(j\\)k\\|l\\[m\\]n\\\\o',
    )
  })

  it('produces a pattern that matches the literal text only', () => {
    const pattern = new RegExp(escapeRegex('le.nne'), 'i')
    expect(pattern.test('Leanne')).toBe(false)
    expect(pattern.test('le.nne')).toBe(true)
  })
})
