import { describe, expect, it } from 'vitest'
import { postSchema, TITLE_MAX_LENGTH } from './schema'

const errorsOf = (input: { title: string; body: string }) => {
  const result = postSchema.safeParse(input)
  if (result.success) return {}
  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]))
}

describe('postSchema', () => {
  it('accepts a valid post and trims surrounding whitespace', () => {
    const result = postSchema.parse({ title: '  Hello  ', body: '\n Some text \n' })
    expect(result).toEqual({ title: 'Hello', body: 'Some text' })
  })

  it('requires a title and a text, treating whitespace-only as empty', () => {
    expect(errorsOf({ title: '', body: '' })).toEqual({
      title: 'titleRequired',
      body: 'bodyRequired',
    })
    expect(errorsOf({ title: '   ', body: ' \n ' })).toEqual({
      title: 'titleRequired',
      body: 'bodyRequired',
    })
  })

  it('allows a title of exactly 100 characters but not 101', () => {
    const body = 'text'
    expect(errorsOf({ title: 'a'.repeat(TITLE_MAX_LENGTH), body })).toEqual({})
    expect(errorsOf({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1), body })).toEqual({
      title: 'titleTooLong',
    })
  })
})
