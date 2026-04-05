# Zorvyn Finance Backend

A backend system for an internal finance dashboard that allows companies to manage financial transactions, control user access, and view analytics — built as part of the Zorvyn FinTech backend engineering assignment.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma v6
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Other:** CORS, dotenv, nodemon

---

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma       # Database models and enums
│   │   ├── prisma.ts               # Prisma client instance
│   │   └── seed.ts                 # Seed script with dummy data
│   ├── middlewares/
│   │   ├── jwt.middleware.ts        # JWT token verification
│   │   └── role.middleware.ts       # Role-based access control
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.route.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── transactions/
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.routes.ts       # Admin routes
│   │   │   └── transaction.routes.public.ts # Public routes (all roles)
│   │   └── user/
│   │       ├── user.controller.ts
│   │       └── user.routes.ts
│   ├── utils/
│   │   └── index.ts
│   ├── zod/
│   │   └── index.ts                # All Zod validation schemas
│   └── index.ts                    # App entry point
├── .env
├── .env.example
├── nodemon.json
├── package.json
└── tsconfig.json
```

---

## Database Schema

### Models

**Users**
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| email | String | Unique email |
| name | String | User name |
| password | String | Hashed password |
| role | Role enum | ADMIN, ANALYST, VIEWER |
| status | Status enum | ACTIVE, INACTIVE |
| createdAt | DateTime | Auto generated |
| updatedAt | DateTime | Auto updated |

**Transactions**
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| amount | Float | Transaction amount |
| type | Type enum | INCOME or EXPENSE |
| category | Category enum | Transaction category |
| description | String? | Optional notes |
| date | DateTime | Actual transaction date |
| userId | String | Who created this record |
| createdAt | DateTime | When record was added |
| updatedAt | DateTime | Auto updated |
| deletedAt | DateTime? | Null = active, timestamp = soft deleted |

**AuditLogs**
| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | Who performed the action |
| action | AuditAction enum | What action was performed |
| entity | AuditEntity enum | What was affected |
| entityId | String | ID of affected record |
| createdAt | DateTime | When action happened |

### Enums

```
Role         → ADMIN, ANALYST, VIEWER
Status       → ACTIVE, INACTIVE
Type         → INCOME, EXPENSE
Category     → SALARY, RENT, UTILITIES, MARKETING, TRAVEL, FOOD,
               SOFTWARE, EQUIPMENT, TAX, SALES, CONSULTING,
               INVESTMENT, REFUND, INTEREST, OTHER
AuditAction  → CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION,
               CREATE_USER, UPDATE_USER, USER_ROLE_CHANGE, USER_STATUS_CHANGE
AuditEntity  → TRANSACTION, USER
```

---

## Role Permissions

| Action                    | VIEWER | ANALYST | ADMIN |
| ------------------------- | ------ | ------- | ----- |
| Login                     | ✅     | ✅      | ✅    |
| View transactions         | ✅     | ✅      | ✅    |
| Create transaction        | ❌     | ❌      | ✅    |
| Update transaction        | ❌     | ❌      | ✅    |
| Delete transaction        | ❌     | ❌      | ✅    |
| Restore transaction       | ❌     | ❌      | ✅    |
| View deleted transactions | ❌     | ❌      | ✅    |
| View dashboard summary    | ❌     | ✅      | ✅    |
| View category breakdown   | ❌     | ✅      | ✅    |
| View monthly trends       | ❌     | ✅      | ✅    |
| View recent transactions  | ❌     | ✅      | ✅    |
| Manage users              | ❌     | ❌      | ✅    |

---

## API Endpoints

### Auth

| Method | Endpoint          | Access | Description                 |
| ------ | ----------------- | ------ | --------------------------- |
| POST   | `/api/auth/login` | Public | Login and receive JWT token |

### Users

| Method | Endpoint                | Access | Description                 |
| ------ | ----------------------- | ------ | --------------------------- |
| POST   | `/api/users`            | Admin  | Create a new user           |
| GET    | `/api/users`            | Admin  | Get all users               |
| GET    | `/api/users/:id`        | Admin  | Get single user             |
| PATCH  | `/api/users/:id/role`   | Admin  | Change user role            |
| PATCH  | `/api/users/:id/status` | Admin  | Activate or deactivate user |

### Transactions

| Method | Endpoint                        | Access    | Description                        |
| ------ | ------------------------------- | --------- | ---------------------------------- |
| POST   | `/api/transactions`             | Admin     | Create a transaction               |
| PATCH  | `/api/transactions/:id`         | Admin     | Update a transaction               |
| DELETE | `/api/transactions/:id`         | Admin     | Soft delete a transaction          |
| PATCH  | `/api/transactions/:id/restore` | Admin     | Restore a soft deleted transaction |
| GET    | `/api/transactions/deleted`     | Admin     | Get all soft deleted transactions  |
| GET    | `/api/transactions/public`      | All roles | Get all active transactions        |
| GET    | `/api/transactions/public/:id`  | All roles | Get single transaction             |

### Dashboard

| Method | Endpoint                    | Access          | Description                        |
| ------ | --------------------------- | --------------- | ---------------------------------- |
| GET    | `/api/dashboard/summary`    | Analyst + Admin | Total income, expense, net balance |
| GET    | `/api/dashboard/categories` | Analyst + Admin | Category wise totals               |
| GET    | `/api/dashboard/trends`     | Analyst + Admin | Monthly income vs expense          |
| GET    | `/api/dashboard/recent`     | Analyst + Admin | Last 10 transactions               |

### Query Parameters

**GET /api/transactions/public**

```
?type=INCOME or EXPENSE
?category=SALARY, RENT, etc.
?startDate=2026-01-01
?endDate=2026-04-04
?page=1
?limit=10
```

**GET /api/dashboard/summary**

```
?startDate=2026-01-01
?endDate=2026-04-04
```

**GET /api/dashboard/categories**

```
?startDate=2026-01-01
?endDate=2026-04-04
```

**GET /api/dashboard/trends**

```
?year=2026
```

**GET /api/dashboard/recent**

```
?limit=5  (default: 10, max: 50)
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL running locally or a connection URL
- pnpm or npm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zorvyn-finance-backend.git
cd zorvyn-finance-backend/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/zorvyn_finance"
JWT_SECRET="your_super_secret_key_here"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the database

```bash
npx prisma db seed
```

This creates the following test accounts:

| Role    | Email             | Password    |
| ------- | ----------------- | ----------- |
| Admin   | admin@zorvyn.io   | Admin@123   |
| Analyst | analyst@zorvyn.io | Analyst@123 |
| Viewer  | viewer@zorvyn.io  | Viewer@123  |

It also creates 20 dummy transactions across January to April 2026.

### 6. Start the development server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## How Authentication Works

1. Login via `POST /api/auth/login` with email and password
2. Receive a JWT token in the response
3. Include the token in all protected requests:

```
Authorization: Bearer <your_token_here>
```

---

## Example Requests

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@zorvyn.io",
  "password": "Admin@123"
}
```

### Create Transaction (Admin only)

```bash
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000,
  "type": "EXPENSE",
  "category": "RENT",
  "date": "2026-04-01",
  "description": "April office rent"
}
```

### Get Dashboard Summary

```bash
GET /api/dashboard/summary
Authorization: Bearer <token>
```

Response:

```json
{
  "totalIncome": 650000,
  "totalExpense": 480000,
  "netBalance": 170000,
  "totalTransactions": 20
}
```

---

## Design Decisions & Assumptions

**1. Internal system design**
This backend is designed as an internal finance management tool for SMEs and startups to track company-level income and expenses — not a personal finance app. All authenticated users see the same company-wide financial data; roles control what actions they can perform.

**2. No open registration**
User registration is not publicly available. The first Admin is created via the seed script and subsequent users are created by the Admin via `POST /api/users`. This is standard practice for internal systems where access must be controlled.

**3. Categories as strict enums**
Transaction categories are enforced as database enums rather than free-text strings. In financial systems, data consistency is critical — free-text categories cause data integrity issues in aggregations, reporting, and audit trails.

**4. Soft delete over hard delete**
Transactions are never permanently deleted. Instead a `deletedAt` timestamp is set. This preserves financial history for audit purposes and allows restoration of accidentally deleted records, which is standard practice in fintech compliance.

**5. Transaction date vs createdAt**
Two separate date fields exist: `date` (when the transaction actually occurred, provided by Admin) and `createdAt` (when the record was entered into the system, automatic). Dashboard analytics group by `date` not `createdAt` to reflect actual financial activity.

**6. AuditLog without metadata**
AuditLog tracks who performed what action and when, but does not store old/new field values in this version. This can be extended in future by adding a `metadata Json?` field via a simple Prisma migration.

**7. Admin cannot modify other Admins**
To prevent privilege escalation and accidental lockouts, Admins cannot change the role or status of other Admin accounts.

**8. Monthly trends via JavaScript grouping**
Monthly trend data is calculated by fetching all transactions for the selected year and grouping them in JavaScript rather than using raw SQL. This ensures all 12 months are always returned in the response (including months with zero transactions), giving the frontend a consistent data shape.

---

## Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production build
npx prisma db seed   # Seed database with test data
npx prisma studio    # Open Prisma Studio GUI
npx prisma migrate dev --name <name>  # Create new migration
```

---

## Error Response Format

All errors follow this consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Common status codes used:

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| 200  | Success                                   |
| 400  | Validation error / Bad request            |
| 401  | Unauthorized (missing or invalid token)   |
| 403  | Forbidden (insufficient role permissions) |
| 404  | Resource not found                        |
| 500  | Internal server error                     |
