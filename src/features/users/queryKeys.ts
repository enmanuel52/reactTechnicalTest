export const usersKeys = {
  all: ['users'] as const,
  list: (query: string) => [...usersKeys.all, 'list', { query }] as const,
  detail: (id: number) => [...usersKeys.all, 'detail', id] as const,
}
