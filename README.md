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

**Vite instead of Next.js.** The brief listed both Next.js and React Router, but Next.js has its own
router, so using both means fighting the framework. This app has no server work: it calls a public
API and stores data in the browser, so most of it would be client components anyway. A Vite
single-page app keeps React Router as asked, is simpler to run, and pairs directly with Vitest.

**Server state, client state and URL state are kept apart.**

- _TanStack Query_ owns everything that comes from the API or IndexedDB (caching, loading/error
  states, retries).
- _Zustand_ holds only UI preferences (theme, language) and the snackbar message.
- _The URL_ holds what should be shareable: the selected user and the search term.

**Creating a post: POST to the API, then save locally.** The mutation sends `POST /posts` and, only if
that succeeds, writes the post to Dexie and refreshes the list. This exercises the real request path
(including its failure and "publishing…" states) and guarantees nothing is saved when the request
fails. The API's response is ignored, since it always answers with the fake id `101`.

**Dexie for the local database.** It is a thin, typed wrapper over IndexedDB: asynchronous,
indexed (posts by `userId`), no size limits like `localStorage`, and it works with fake-indexeddb in
tests. A SQL-in-the-browser option would have added megabytes of WebAssembly for a table with five
columns.

**Local posts are pinned on top.** They come from a different source (IndexedDB), so they are a
separate query listed above the API's posts, newest first. They still show when the API request
fails, and the post count covers both.

**Server-side search.** Search uses the API's `name_like`, so the filtering happens on the server and
each search is a single request. It is debounced (300 ms). Two details worth knowing: `name_like` is a regular
expression on the server (an unescaped `(` is a 500, and `.` matches anything), so input is escaped
first; and previous results stay on screen while the next ones load, instead of flashing a spinner.

**No pagination.** JSONPlaceholder has exactly 10 users and 10 posts per user. With a page size of
10, every list fit on its first page, so pagination added requests, code and a "Load more" control
that could never appear. Both lists are now loaded in one request each. Tests check that the
requests carry no `_page` / `_limit` and that a list longer than 10 still renders in full. If the
data grew, `useInfiniteQuery` with `_page` / `_limit` (and the `X-Total-Count` header for the total)
would be the way back.

**A user can be opened directly by URL.** Selecting a user reuses the cached list when possible, and
otherwise fetches `/users/:id`, so `/users/7` works on a cold start. Unknown ids show a not-found state.

**Form validation with zod + React Hook Form.** Title is required (trimmed) and at most 100
characters, with a live counter; text is required (trimmed). Validation runs on submit, then on every
change, and focus moves to the first invalid field. The schema returns message _keys_ that the form
translates, so validation doesn't depend on the active language.

**Failing fast offline.** By default TanStack Query pauses requests while the browser is offline,
which would leave the UI on a spinner forever. Requests use `networkMode: 'always'` so errors (and
the Retry buttons) appear. 4xx responses aren't retried; network and 5xx errors are retried once.

**Performance.** The user-detail route is lazy-loaded, which keeps React Hook Form, zod and Dexie out
of the first bundle (≈594 kB → ≈366 kB, 116 kB gzipped). Derived values are computed during render
rather than copied into state, there are no barrel files, and effects are used only to synchronise
with outside systems (timers, `<html>` attributes, the URL).

**Accessibility.** Real buttons, links and labels; `role="status"` / `role="alert"` for loading and
errors; `aria-live` for result counts; `aria-invalid` + `aria-describedby` on fields; visible focus;
44 px+ touch targets; reduced-motion respected. Theme and language are applied before first paint to
avoid a flash.

**Styling.** The design's Material 3 colour roles are CSS variables (light and dark) exposed as
Tailwind utilities (`bg-surface-low`, `text-on-surface-variant`, …), so components never hard-code
colours and dark mode is a single class on `<html>`.

**Internationalisation.** A small typed dictionary (`en` is the source of truth, `es` must match
it) instead of a library; enough for two languages and about 40 strings.

**Project layout** is by feature, with shared building blocks separate:

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

- **End-to-end tests** (Playwright) for the full flow in a real browser, plus automated
  accessibility checks (axe) and visual regression tests for light/dark and mobile.
- **Edit and delete your own posts**, and a way to reuse the local data across devices (sync queue,
  PWA/offline mode, or a real backend).
- **Optimistic updates** for new posts instead of waiting for the write to finish.
- **Pagination and list virtualisation** (TanStack Virtual) if the data grew, and remember the scroll
  position when going back to the list. With 10 users and 10 posts each, neither is needed today.
- **Prefetch the detail route** on hover/focus so opening a user never waits for its code or posts.
- **Handle IndexedDB being unavailable** (some private modes). Today the post list still works but
  publishing would show an error; it could fall back to in-memory storage with a notice.
- **Move to `react-i18next`** if more languages or plural/format rules are needed; add language
  detection from the URL.
- **Stronger resilience**: request timeouts, exponential backoff, an error-monitoring service
  (Sentry), and a global offline banner.
- **Developer experience**: CI (lint, typecheck, tests, build on every PR), pre-commit hooks,
  Storybook for the UI primitives, MSW in the dev server so loading/error states can be demoed on
  demand, and stricter lint rules (e.g. `strict-type-checked`).
- **Documentation**: an architecture decision record per major choice, and a CONTRIBUTING guide.
