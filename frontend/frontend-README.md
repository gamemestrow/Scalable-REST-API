# TaskAPI Frontend

A React.js frontend for the TaskAPI — featuring user authentication, protected routes, task management dashboard, and an admin panel.

---

## Tech Stack

- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Redirects to login if not authenticated
│   │   └── TaskCard.jsx          # Individual task card component
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state (user, token, login, logout)
│   ├── pages/
│   │   ├── Login.jsx             # Login page with toast notifications
│   │   ├── Register.jsx          # Register page
│   │   ├── Dashboard.jsx         # Protected task management page
│   │   └── AdminPanel.jsx        # Admin only — manage users and tasks
│   ├── App.jsx                   # Routes setup
│   └── main.jsx                  # App entry point with AuthProvider
├── .env                          # Environment variables (gitignored)
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start the development server
```bash
npm run dev
```

App runs at:
```
http://localhost:5173
```

---

## Pages

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Login with email and password |
| Register | `/register` | Create a new account |

### Protected Pages
| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Dashboard | `/dashboard` | All users | View and manage your tasks |
| Admin Panel | `/admin` | Admin only | Manage all users and tasks |

---

## Features

### Authentication
- Register and login with email and password
- JWT token stored in localStorage
- Auto redirect to login on token expiry
- Toast notifications for success and error messages

### Dashboard
- View all your tasks in a responsive grid
- Create new tasks with title, description, priority, and due date
- Edit existing tasks
- Change task status (Todo, In Progress, Done)
- Delete tasks

### Admin Panel
- Stats cards showing total users, tasks, completed tasks, and in progress tasks
- View all users with their roles
- View all tasks from all users
- Delete any user or task
- Tab switching between Users and Tasks views

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## Default Admin Account

```
Email:    admin@taskapi.com
Password: Admin@123
```

---

## Axios Interceptors

The Axios instance automatically:
- Attaches JWT token to every request via `Authorization: Bearer <token>` header
- Redirects to `/login` if token is expired (401 response) and user is already logged in
