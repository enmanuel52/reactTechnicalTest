# theSocialNetwork

A small React + TypeScript app on top of [JSONPlaceholder](https://jsonplaceholder.typicode.com):
browse and search users, open one to see their posts, and write new posts of your own.

JSONPlaceholder accepts writes but never stores them, so posts you create are saved in the browser
(IndexedDB, through Dexie) and shown above the API's posts with a **New** badge.

## Features

- **Users list** with server-side search by name (`?q=` is kept in the URL, so a search can be shared).
- **User detail** with their posts, and a form to create a new one (title and text validated).
- **No pagination**: all users load in one request, and so do a user's posts (the API has 10 users
  and 10 posts per user).
- **Loading and error states** everywhere: first load, search, retry buttons, empty and
  "no results" screens, a not-found page, and a route-level error boundary.
- **Your posts are pinned first** with a "New" badge and survive reloads.
- **Light / dark theme** and **Spanish / English**. Both follow the browser on the first visit and are
  remembered afterwards.
- **Responsive**: two panes on desktop; on small screens one pane at a time, chosen by the route.
- Follows the [design canvas](https://claude.ai/artifact/NNjxv8EZku19Uy6EaHSzj6) (Material 3 colours, Roboto).

## Running the project

Requires **Node 22.12 or newer** and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                      |
| `npm run build`     | Typecheck and build for production into `dist` |
| `npm run preview`   | Serve the production build locally             |
| `npm test`          | Run the tests in watch mode                    |
| `npm run test:run`  | Run the tests once                             |
| `npm run coverage`  | Run the tests once with a coverage report      |
| `npm run lint`      | ESLint                                         |
| `npm run typecheck` | TypeScript, no emit                            |
| `npm run format`    | Prettier                                       |

### Tests

47 tests with [Vitest](https://vitest.dev), Testing Library and [MSW](https://mswjs.io) (the API is
mocked at the network level, so the real `fetch` code runs). IndexedDB is provided by
`fake-indexeddb`. They cover:

- **Pure logic**: the HTTP client, regex escaping, initials/avatar colours, the zod schema, retry policy.
- **Hooks and stores**: debounce, theme/language preferences.
- **User flows** through the real route tree: list, loading/error/retry, search, deep links,
  loading everything in one request, posts, validation, creating a post (API call + local save + "New" badge), local
  posts shown when the API fails, language switch.

## Stack

React 19, TypeScript (strict), Vite, React Router, TanStack Query, React Hook Form + zod, Zustand,
Dexie, Tailwind CSS v4, Vitest.

## Decisions

- **Vite instead of Next.js.** The app has no server-side logic: it consumes a public API and stores
  data in the browser. A single-page app with Vite is simpler to run and integrates directly with Vitest.
- **Server state, client state and URL state are kept apart.** TanStack Query handles whatever comes
  from the API or IndexedDB (caching, loading, errors, retries); Zustand only holds UI preferences
  (theme, language) and the snackbar message; the URL holds what should be shareable (the selected
  user and the search term).
- **Creating a post: POST to the API, then save locally.** Only if `POST /posts` succeeds is the post
  written to Dexie and the list refreshed, so nothing is saved if the request fails. The API's
  response is ignored because it always returns the fake id `101`.
- **Dexie for the local database.** A lightweight database without the limits of `localStorage`. A SQL
  database in the browser would have added megabytes of WebAssembly for a table with five columns.
- **Local posts pinned on top.** They come from a different source (the DB), so they are a separate
  query, listed above the API's posts and ordered from newest to oldest. They still show when the API
  fails.
- **No pagination.** JSONPlaceholder has 10 users and 10 posts per user; pagination would add
  unnecessary complexity.
- **Opening a user directly by URL.** The cached list is reused, or `/users/:id` is fetched, so
  `/users/7` works on a cold start; unknown ids show a "not found" state.
- **Validation with zod + React Hook Form.** Title is required (max. 100 characters, with a counter)
  and text is required. The schema returns message _keys_ that the form translates, so validation
  doesn't depend on the active language.
- **Failing fast offline.** `networkMode: 'always'` is used so that errors and retry buttons appear
  instead of an endless spinner. 4xx responses aren't retried; network and 5xx errors are retried once.
- **Styling and internationalisation.** The Material 3 colours are CSS variables exposed as Tailwind
  utilities (dark mode is a single class on `<html>`). For i18n, a small typed dictionary of our own
  is used (`en` is the source of truth), enough for two languages.
- **Feature-based structure**, with shared building blocks kept separate (`app/`, `features/`,
  `shared/`, `test/`).

```
src/
  app/        providers, router, layout, header, error/not-found pages
  features/
    users/    list, search, avatar, user detail
    posts/    posts list, new-post form, schema, Dexie access
  shared/     http client, Dexie setup, hooks, i18n, stores, UI primitives
  test/       MSW handlers, render helpers, test setup
```

## What I'd do with more time

- **Edit and delete your own posts**, and sync the local data across devices (sync queue,
  PWA/offline mode or a real backend).
- **Optimistic updates** when creating posts.
- **Pagination and list virtualisation** (TanStack Virtual) if the data grew, and remember the scroll
  position when going back to the list.
- **Prefetch the detail route** on hover or when focusing a user.
- **Handle IndexedDB being unavailable** (some private modes) with an in-memory fallback and a notice.
- **Move to `react-i18next`** if more languages or plural/format rules are needed.
- **Stronger resilience**: timeouts, exponential backoff, error monitoring (Sentry) and a global
  offline banner.
- **Developer experience**: CI, pre-commit hooks, Storybook, MSW in the dev server and stricter lint
  rules.

## How I used AI

- **Claude-design** to create a responsive design covering the app's features.
- **Responsiveness**: on desktop screens the information is shown in a classic list/detail view,
  while on mobile devices it is split across two screens.
- **Plan mode**: although SDD (Spec-Driven Development) is my preferred methodology for AI-first
  projects, I chose plan mode in **Claude** because it is more than enough given how simple this
  project is.
- **Claude-interview** to cover all the edge cases, refine and improve the initial specifications,
  resolve ambiguities and contradictions in the stack, and finally produce a detailed build plan
  that serves as a guide to develop the project step by step.
- **Prompting**: I listed every feature the project would have, including specifications for post
  management, and included the stack to be used in the app. I'd highlight the use of the right
  terminology to trigger skills.
- **Git**: I have a skill that basically defines how Gitflow is applied: branches for the different
  features, the commit message format, and commits for modular, functional changes. This way the
  step-by-step implementation planned beforehand is recorded with **claude-code**.
- **Skills**: I use skills that define architecture, code quality and testing practices.
