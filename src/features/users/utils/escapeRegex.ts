/**
 * JSONPlaceholder's `name_like` treats its value as a regular expression, so
 * "(" is a server error and "." matches anything. Escape user input first.
 */
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
