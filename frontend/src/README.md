# Frontend Source Structure

```
src/
├── api/              # axios instance, generic API helpers, React Query client
├── components/
│   ├── common/       # Reusable, business-agnostic UI: Button, Input, Card, Modal, Spinner, Badge, EmptyState, ErrorBoundary
│   ├── layout/        # Navbar, Sidebar, MainLayout
│   ├── board/         # (Phase 2+) Board column / drag-and-drop board components
│   ├── task/          # (Phase 2+) Task card, task detail, task form
│   └── project/       # (Phase 2+) Project card, project form
├── context/           # (Phase 2+) React Context providers (e.g. AuthContext, ThemeContext)
├── hooks/              # Custom hooks (useSocket, and future useAuth, useDebounce, etc.)
├── pages/              # Route-level page components
├── routes/             # React Router route configuration
├── sockets/            # Socket.IO client singleton + room helpers
├── store/              # (Phase 2+) Global client state if needed beyond React Query/Context
├── styles/             # Tailwind entry CSS
└── utils/              # cn(), constants, date formatting helpers
```

## Conventions

- **Reusable components first**: anything in `components/common` must stay
  free of API calls or business logic — it should only receive props.
- **Data fetching**: use React Query (`@tanstack/react-query`) via hooks
  built on top of `api/index.js`. Co-locate resource-specific query hooks
  (e.g. `useProjects.js`) inside `hooks/` as they're built.
- **Forms**: use `react-hook-form`, pairing `register()` with the
  `Input` component's forwarded ref.
- **Real-time**: use the `useSocket` hook and `joinRoom`/`leaveRoom`
  helpers from `sockets/socket.js` to scope events to a board/project.
- **Error handling**: page-level content is wrapped in `<ErrorBoundary>`
  inside `MainLayout`; network errors surface through React Query's
  `isError`/`error` state, already normalized by the axios interceptor.
- **No authentication yet**: routes are not currently protected. A
  `ProtectedRoute` wrapper and `AuthContext` will be added in the next
  phase alongside login/register pages.
