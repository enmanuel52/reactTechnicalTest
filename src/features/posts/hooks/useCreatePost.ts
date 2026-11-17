import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRemotePost } from '../api'
import { addLocalPost } from '../localPosts'
import { postsKeys } from '../queryKeys'
import type { PostInput } from '../schema'

/**
 * Sends the post to the API, then saves it locally. Saving happens only after
 * the request succeeds, so a failed request leaves nothing behind. (The API
 * itself doesn't keep the post, which is why the local copy is the real one.)
 */
export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: PostInput) => {
      await createRemotePost({ userId, ...input })
      return addLocalPost(userId, input)
    },
    // Returning the promise keeps the mutation "pending" until the list has refreshed.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postsKeys.localByUser(userId) }),
  })
}
