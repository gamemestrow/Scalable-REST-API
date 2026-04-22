# TaskAPI Backend

A scalable REST API built with Node.js, Express, and PostgreSQL featuring JWT authentication and Role-Based Access Control (RBAC).

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger UI
- **Security**: Helmet, CORS, Rate Limiting

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── auth.controller.js  # Register, Login, Get Me
│   │   ├── user.controller.js  # User management (Admin)
│   │   └── task.controller.js  # Task CRUD
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── role.middleware.js  # Role-based access
│   ├── models/
│   │   ├── User.js             # User DB queries
│   │   └── Task.js             # Task DB queries
│   ├── routes/
│   │   └── v1/
│   │       ├── auth.routes.js
│   │       ├── user.routes.js
│   │       ├── task.routes.js
│   │       └── index.js
│   ├── validators/
│   │   └── auth.validator.js
│   ├── utils/
│   │   ├── jwt.js              # Token generation & verification
│   │   └── response.js         # Standard API response helpers
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
├── swagger/
│   └── swagger.yaml            # API documentation
├── .env                        # Environment variables (gitignored)
├── .env.example
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskapi_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
```

### 3. Setup PostgreSQL database
```bash
psql -U postgres
CREATE DATABASE taskapi_db;
\c taskapi_db
```

Then run the schema from `src/config/schema.sql`.

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login and get token |
| GET | `/api/v1/auth/me` | Protected | Get current user |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks` | Protected | Get my tasks |
| POST | `/api/v1/tasks` | Protected | Create a task |
| GET | `/api/v1/tasks/:id` | Protected | Get single task |
| PUT | `/api/v1/tasks/:id` | Protected | Update a task |
| DELETE | `/api/v1/tasks/:id` | Protected | Delete a task |
| GET | `/api/v1/tasks/admin/all` | Admin only | Get all tasks |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users/me` | Protected | Get my profile |
| GET | `/api/v1/users` | Admin only | Get all users |
| GET | `/api/v1/users/:id` | Admin only | Get single user |
| DELETE | `/api/v1/users/:id` | Admin only | Delete a user |

---

## API Documentation

Swagger UI is available at:
```
http://localhost:5000/api-docs
```

---

## Default Admin Account

```
Email:    admin@taskapi.com
Password: Admin@123
```

---

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- JWT token authentication
- Role-based access control (user / admin)
- Rate limiting (100 requests per 15 minutes)
- HTTP security headers with Helmet
- CORS protection
- Input validation and sanitization

---

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "timestamp": "2026-04-22T00:00:00.000Z"
}
```

Paginated responses include:
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```
