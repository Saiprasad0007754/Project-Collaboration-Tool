# Backend Source Structure

This document explains the purpose of each folder under `src/`. Folders that
are currently empty (besides a `.gitkeep`) are intentionally scaffolded for
upcoming feature work — including authentication, which was explicitly
excluded from this phase.

```
src/
├── config/         # Environment loading, DB connection, Cloudinary, logger
├── controllers/    # Route handler logic (Phase 2+: auth, users, projects, boards, tasks)
├── models/         # Mongoose schemas (Phase 2+: User, Workspace, Project, Board, Task, Comment)
├── routes/         # Express routers, mounted in routes/index.js
├── middlewares/    # Error handling, validation, uploads, rate limiting
├── utils/          # ApiError, ApiResponse, asyncHandler, sendEmail, pagination
├── validators/     # express-validator rule chains per resource
├── services/       # Business logic decoupled from controllers (reusable, testable)
└── sockets/         # Socket.IO server init + real-time event handlers
```

## Conventions

- **MVC**: Controllers stay thin — they validate input shape (via
  `middlewares/validate.js`), delegate to `services/`, and format the
  response with `utils/ApiResponse.js`.
- **Error handling**: Always throw `ApiError` (or let Mongoose/JWT errors
  bubble up) inside an `asyncHandler`-wrapped route. The global
  `errorHandler` middleware normalizes and logs everything centrally.
- **Validation**: Define rule chains in `validators/`, then apply
  `[...rules, validate]` in the route definition.
- **No authentication yet**: JWT/bcrypt dependencies and env vars are wired
  up but unused. Auth routes/controllers/middleware will be added in the
  next phase (register, login, refresh tokens, password reset via
  Nodemailer, route protection middleware, role-based access control).
