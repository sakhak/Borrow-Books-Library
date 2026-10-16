# Borrow Books Library

A library management system: manage books, authors, categories and members, lend books and track returns,
overdue loans and fines, watch stock levels, and manage staff.

- **backend/** – Laravel 12 REST API (JWT auth via `tymon/jwt-auth`)
- **frontend/** – React 19 + Vite + Tailwind admin panel

## Features

| Area | What it does |
| --- | --- |
| Auth | Register / login (JWT), protected routes, logout, auto-redirect when the token expires |
| Dashboard | Totals, loans per month, most borrowed books, recent activity, overdue list |
| Authors / Categories / Books | Create, edit, delete, search, pagination, photo / cover upload |
| Members | Auto-generated member codes (`MBR-0001`), active/inactive status, active-loan count |
| Borrowing | Borrow a book (14-day default, max 5 loans per member), return it, overdue tracking, **$0.25/day late fine** |
| Inventory | Stock per title (total / available / on loan), low & out-of-stock filters, adjust total copies |
| Employees / Users | Full CRUD with photo upload (users = staff who can log in) |

Safety rules enforced by the API: a book can't be borrowed with 0 copies left, borrowed twice by the same member,
or by an inactive member; a book/member with borrowing history can't be deleted (set it to Inactive); total copies
can't be set below the number currently on loan; you can't delete your own account.

## Setup

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
touch database/database.sqlite          # default DB is SQLite; or configure MySQL in .env
php artisan migrate:fresh --seed        # creates tables, roles, admin user and demo data
php artisan storage:link                # needed so uploaded images are visible
php artisan serve                       # http://localhost:8000
```
Default login: **admin@library.com / password123** (change it after first login).

> The migrations were fixed in this version (`users.address/image` and `employees.image` are now nullable, the
> empty `drop_employees_table` migration was removed). Use `migrate:fresh` if you already have an old database.

### Frontend
```bash
cd frontend
npm install
npm run dev                             # http://localhost:5173
```
The API URL is set in `frontend/src/utils/config.js`.

### Tests
```bash
cd backend && php artisan test
```
