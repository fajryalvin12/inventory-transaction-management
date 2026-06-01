# Inventory & Transaction Management System

A fullstack inventory and transaction management application built with React, Node.js, Express, PostgreSQL, and Prisma.

The system helps small businesses manage products, monitor inventory levels, process transactions, and track business performance through a simple analytics dashboard.

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)

---

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Protected routes and authorization

### Dashboard Analytics

- Total products overview
- Total transactions overview
- Revenue summary
- Low stock monitoring
- Recent transaction activity

### Product Management

- Create, update, delete products
- Product search functionality
- Product status management
- Inventory tracking
- Low stock indicators

### Transaction Management

- Create new transactions
- Automatic stock deduction
- Transaction history
- Transaction detail view
- Revenue calculation
- Atomic database transactions

---

## Screenshots

### Dashboard

![Dashboard](./frontend/src/assets/Dashboard%20Summary.png)

### Product Management

![Products](./frontend/src/assets/Product%20Page.png)

### Create Transaction

![Create Transaction](./frontend/src/assets/Create%20Transaction.png)

### Transaction Detail

![Transaction Detail](./frontend/src/assets/Transaction%20Page.png)

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

---

## Project Structure

```text
inventory-transaction-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/fajryalvin12/inventory-transaction-system.git
cd inventory-transaction-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

Run migration

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Run backend

```bash
node index.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

Backend will run on:

```text
http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |

### Products

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/products`     | Get all products   |
| GET    | `/products/:id` | Get product detail |
| POST   | `/products`     | Create product     |
| PUT    | `/products/:id` | Update product     |
| DELETE | `/products/:id` | Delete product     |

### Transactions

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/transactions`     | Get transaction list   |
| GET    | `/transactions/:id` | Get transaction detail |
| POST   | `/transactions`     | Create transaction     |

### Dashboard

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/dashboard/summary` | Dashboard analytics summary |

---

## Business Logic Highlights

### Inventory Management

- Automatic stock deduction after successful transactions
- Low-stock monitoring
- Product availability tracking

### Transaction Processing

- Atomic database transactions using Prisma Transaction API
- Prevents inconsistent stock updates
- Revenue calculation based on transaction items

### Dashboard Analytics

- Product count
- Transaction count
- Revenue summary
- Low-stock product monitoring

---

## Future Improvements

- Sales charts and analytics
- Revenue reports
- Product categories
- Export transactions to Excel/PDF
- Role-Based Access Control (RBAC)
- Customer management module

---

## Author

**Fajry Alvin**

Fullstack Web Developer

Tech Stack:

- JavaScript
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- React
- Next.js

---

## License

MIT License
