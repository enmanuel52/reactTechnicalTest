export const postsKeys = {
  all: ['posts'] as const,
  byUser: (userId: number) => [...postsKeys.all, 'user', userId] as const,
}
