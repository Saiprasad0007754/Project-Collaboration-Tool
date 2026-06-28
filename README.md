# Project Collaboration Tool (MERN)

A production-ready foundation for a Trello/Jira/Asana-style project
collaboration tool, built on the MERN stack. **Authentication is
intentionally not implemented in this phase** — the scaffolding, security
middleware, env wiring, and JWT/Bcrypt dependencies are in place so auth can
be added next without restructuring anything.

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, React Query,
React Hook Form, React DnD, Framer Motion, Socket.IO Client

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Socket.IO,
Cloudinary, Multer, Nodemailer

## Project Structure

```
project-collab-tool/
├── backend/
│   ├── src/
│   │   ├── config/        # env, db, cloudinary, logger
│   │   ├── controllers/   # (Phase 2+)
│   │   ├── models/        # (Phase 2+)
│   │   ├── routes/        # health route + central router
│   │   ├── middlewares/   # error handler, validation, upload, rate limit, sanitizer
│   │   ├── utils/         # ApiError, ApiResponse, asyncHandler, sendEmail, pagination
│   │   ├── validators/    # (Phase 2+)
│   │   ├── services/      # (Phase 2+)
│   │   ├── sockets/        # Socket.IO server + events
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/            # Multer temp storage before Cloudinary upload
│   ├── logs/                # Winston log files
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/             # axios instance, React Query client
    │   ├── components/
    │   │   ├── common/       # Button, Input, Card, Modal, Spinner, Badge, EmptyState, ErrorBoundary
    │   │   ├── layout/        # Navbar, Sidebar, MainLayout
    │   │   ├── board/ task/ project/  # (Phase 2+)
    │   ├── context/           # (Phase 2+)
    │   ├── hooks/              # useSocket
    │   ├── pages/              # Home, Dashboard, Projects, NotFound
    │   ├── routes/             # React Router config
    │   ├── sockets/             # Socket.IO client
    │   ├── store/                # (Phase 2+)
    │   ├── styles/                # Tailwind entry CSS
    │   └── utils/                  # cn(), constants, dateUtils
    ├── .env.example
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

See `backend/src/README.md` and `frontend/src/README.md` for folder-level
conventions.

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional for now) Cloudinary account, SMTP credentials — only needed once
  upload/email features are implemented

### 1. Backend setup

```bash
cd backend
cp .env.example .env   # then fill in MONGO_URI at minimum
npm install
npm run dev             # starts on http://localhost:5000 with nodemon
```

Verify it's running:
```bash
curl http://localhost:5000/api/v1/health
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev             # starts on http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to `http://localhost:5000`,
so the frontend can call relative paths in development without CORS issues.

### 3. Build for production

```bash
# Frontend
cd frontend && npm run build   # outputs to frontend/dist

# Backend
cd backend && npm start
```

## What's Already Wired Up

- ✅ Clean MVC folder structure on the backend (controllers/models/routes/services empty but scaffolded)
- ✅ Centralized error handling (`ApiError`, `errorHandler` middleware, normalizes Mongoose/JWT errors)
- ✅ Centralized success response shape (`ApiResponse`)
- ✅ `asyncHandler` to remove try/catch boilerplate in controllers
- ✅ express-validator `validate` middleware, ready for per-resource validators
- ✅ Security middleware: Helmet, CORS, Mongo sanitize, in-house XSS sanitizer, HPP, rate limiting
- ✅ Winston logging (console + file) with Morgan HTTP request logs
- ✅ MongoDB connection with graceful shutdown handling
- ✅ Cloudinary config + upload/delete helpers
- ✅ Multer middleware for multipart uploads (disk storage, MIME/size validation)
- ✅ Nodemailer email utility
- ✅ Socket.IO server with room join/leave pattern, ready for real-time task/board events
- ✅ React app with Vite, React Router, Tailwind (custom theme tokens, dark mode class strategy)
- ✅ Axios instance with interceptors (error normalization, `withCredentials` for future cookie auth)
- ✅ React Query client with sensible cache defaults
- ✅ Socket.IO client singleton + `useSocket` hook
- ✅ Reusable UI components: Button, Input, Card, Modal, Spinner, Badge, EmptyState, ErrorBoundary
- ✅ App shell: Navbar, Sidebar, MainLayout with per-page ErrorBoundary
- ✅ React DnD provider wired at the app root, ready for board drag-and-drop
- ✅ Framer Motion used for page/modal transitions

## Explicitly Not Implemented (By Design)

- Authentication (register/login/JWT issuance/refresh tokens/password reset)
- Route protection / role-based access control
- Any actual data models (User, Workspace, Project, Board, Task, Comment)
- Real-time event payloads beyond the room join/leave scaffold

These are intended for the next phase, building directly on top of this
structure.
