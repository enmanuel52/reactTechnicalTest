export const postsKeys = {
  all: ['posts'] as const,
  byUser: (userId: number) => [...postsKeys.all, 'user', userId] as const,
  localByUser: (userId: number) => [...postsKeys.all, 'local', userId] as const,
}
