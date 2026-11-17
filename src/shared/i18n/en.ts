/** English is the source of truth: `Dictionary` is derived from it. */
export const en = {
  appLanguage: 'Language',
  switchToDark: 'Switch to dark mode',
  switchToLight: 'Switch to light mode',

  users: 'Users',
  searchLabel: 'Search users by name',
  searchPlaceholder: 'Search by name',
  clearSearch: 'Clear search',
  usersCount: (n: number) => (n === 1 ? '1 user' : `${n} users`),
  loadingUsers: 'Loading users…',
  usersErrorTitle: "We couldn't load users",
  errorBody: 'Check your connection and try again.',
  retry: 'Try again',
  noResults: (query: string) => `No users match "${query}"`,
  noResultsHint: 'Try another name.',

  pickUserTitle: 'Pick a user',
  pickUserBody: "You'll see their posts here and can write a new one.",
  backToUsers: 'Users',
  userNotFoundTitle: 'User not found',
  userNotFoundBody: "We couldn't find that user.",

  newPost: 'New post',
  titleLabel: 'Title',
  bodyLabel: 'Text',
  requiredNote: '* Required',
  titleRequired: 'Add a title.',
  titleTooLong: '100 characters max.',
  bodyRequired: 'Write the post text.',
  demoNote: "The demo API doesn't save data: your post will only appear in this list.",
  publish: 'Publish',
  publishing: 'Publishing…',
  publishError: "We couldn't publish your post. Try again.",
  postPublished: 'Post published',

  posts: 'Posts',
  postsCount: (n: number) => (n === 1 ? '1 post' : `${n} posts`),
  loadingPosts: 'Loading posts…',
  postsErrorTitle: "We couldn't load posts",
  noPostsTitle: 'No posts yet',
  noPostsBody: 'Write the first one with the form.',
  newBadge: 'New',

  loadMore: 'Load more',
  loadingMore: 'Loading more…',
  loadMoreError: "We couldn't load more.",

  notFoundTitle: 'Page not found',
  notFoundBody: "The page you're looking for doesn't exist.",
  goHome: 'Go to users',
  unexpectedErrorTitle: 'Something went wrong',
}

export type Dictionary = typeof en
