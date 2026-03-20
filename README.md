# Shop Fullstack

A fullstack e-commerce application built with ASP.NET Core and React.

## Tech Stack

**Backend:**
- ASP.NET Core 9 — REST API
- Entity Framework Core — ORM
- SQLite — database
- JWT Authentication
- BCrypt — password hashing

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Axios
- React Router

## Features

- Register / Login with JWT
- Product listing
- Product detail page
- Shopping cart
- Place orders
- Orders history page

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register | ❌ |
| POST | /api/v1/auth/login | Login | ❌ |
| GET | /api/v1/products | Get all products | ❌ |
| GET | /api/v1/products/{id} | Get product by id | ❌ |
| POST | /api/v1/products | Create product | ✅ |
| PUT | /api/v1/products/{id} | Update product | ✅ |
| DELETE | /api/v1/products/{id} | Delete product | ✅ |
| GET | /api/v1/orders | Get all orders | ✅ |
| POST | /api/v1/orders | Place order | ✅ |

## Getting Started

**Backend:**
```bash
cd ShopApi
dotnet run
```

**Frontend:**
```bash
cd shop-frontend
npm install
npm run dev
```

## Author
Denis
