# Employee Management System (Task 2 - Prodigy InfoTech)

A web application for admins to perform CRUD (Create, Read, Update, Delete)
operations on employee records, with login authentication and input validation.

## Tech stack
- **Backend:** Node.js + Express
- **Auth:** express-session (session cookies) + bcryptjs (password hashing)
- **Storage:** JSON files (`data/employees.json`, `data/users.json`) — no
  external database setup needed, but the code is structured so it is easy
  to swap in MySQL/MongoDB later (all data access goes through `db.js`)
- **Frontend:** Plain HTML, CSS, JavaScript (no framework, so it's easy to read)

## Features
- Admin login/logout with hashed passwords and session-based authentication
- Every `/api/employees` route is protected — logged-out users get `401 Unauthorized`
- Create, list, update, and delete employee records
- Server-side validation (name length, email format, 10-digit phone, positive
  salary, valid date) — returns clear error messages if invalid
- Client-side form + friendly error/success messages (toast notifications)
- Responsive UI (works on mobile too)

## Project structure
```
employee-management-system/
├── server.js              # App entry point
├── db.js                  # JSON-file based data layer + seed data
├── middleware/auth.js      # Route protection middleware
├── routes/auth.js          # /api/login, /api/logout, /api/session
├── routes/employees.js     # /api/employees CRUD + validation
├── data/                   # employees.json & users.json (auto-created)
└── public/                 # Frontend (login.html, dashboard.html, css, js)
```

## How to run

1. Make sure [Node.js](https://nodejs.org) (v16+) is installed.
2. Open a terminal in this folder and install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser at: **http://localhost:3000**

On first run, the app automatically creates:
- An admin account — **username: `admin`**, **password: `admin123`**
- Two sample employee records

You can change the default admin password by editing `data/users.json`
(delete the file and change the seed in `db.js` before restarting, or add a
"change password" feature yourself as an extension).

## API reference

| Method | Endpoint              | Description                | Auth required |
|--------|-----------------------|-----------------------------|:---:|
| POST   | /api/login             | Log in                     | No |
| POST   | /api/logout            | Log out                    | Yes |
| GET    | /api/session           | Check current login state  | No |
| GET    | /api/employees         | List all employees         | Yes |
| GET    | /api/employees/:id     | Get one employee           | Yes |
| POST   | /api/employees         | Create an employee         | Yes |
| PUT    | /api/employees/:id     | Update an employee         | Yes |
| DELETE | /api/employees/:id     | Delete an employee         | Yes |

## Possible extensions (for a stronger submission)
- Replace JSON file storage with MongoDB/MySQL
- Add pagination and search/filter on the employee table
- Add role-based access (admin vs regular staff)
- Add "Forgot password" and multi-user admin accounts
- Write automated tests (e.g., with Jest + Supertest)
