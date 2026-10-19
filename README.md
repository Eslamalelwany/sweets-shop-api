# Sweets Shop API

A REST API for an online sweets shop, built with Node.js, Express and MongoDB. It covers authentication, role-based access control, a product catalogue and a full order flow for customers and the shop owner.

## Tech Stack

- **Node.js** and **Express**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing

## Features

- Register and login with hashed passwords and JWT tokens
- Role-based access: `customer` and `owner`
- Products: public browsing, owner-only create, update and delete
- Orders: create, view your own orders, cancel your own order
- Owner tools: view all orders and update order status
- Centralized error handling with a custom `AppError` class and an async wrapper

## Getting Started

```bash
git clone https://github.com/<your-username>/sweets-shop-api.git
cd sweets-shop-api
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

Environment variables (see `.env.example`):

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret used to sign and verify tokens |
| `PORT` | Port the server listens on |

To generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Authentication

Protected endpoints expect a token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/users/register` | Public | Create an account |
| POST | `/api/v1/users/login` | Public | Log in and receive a token |

### Products

| Method | Path | Auth | Role | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/products` | Public | - | List all products |
| GET | `/api/v1/products/:Id` | Public | - | Get a single product |
| POST | `/api/v1/products` | Required | owner | Create a product |
| PATCH | `/api/v1/products/:Id` | Required | owner | Update a product |
| DELETE | `/api/v1/products/:Id` | Required | owner | Delete a product |

### Orders

| Method | Path | Auth | Role | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/orders` | Required | any | Create an order |
| GET | `/api/v1/orders/my-orders` | Required | any | List the current user's orders |
| GET | `/api/v1/orders/all-orders` | Required | owner | List every order |
| GET | `/api/v1/orders/:Id` | Required | owner or order's user | Get a single order |
| PATCH | `/api/v1/orders/:Id` | Required | owner | Update order status |
| PATCH | `/api/v1/orders/cancel/:Id` | Required | order's user | Cancel your own order |

### Example: create an order

```json
POST /api/v1/orders
{
  "products": [
    { "product": "<productId>", "quantity": 2 },
    { "product": "<productId>", "quantity": 1 }
  ],
  "shippingAddress": "12 Tahrir Street, Cairo, Egypt"
}
```

The client only sends product ids and quantities. Prices, the total and the user are all resolved on the server.

## Design Decisions

**Prices come from the database, never from the request.**
The client sends only product ids and quantities. The server reads the real prices from the database and calculates the total, so nobody can tamper with the amount by editing the request.

**Each order item stores `priceAtOrder`.**
Product prices can change over time. Saving a snapshot of the price on the order keeps old orders accurate, instead of silently changing when a product is repriced.

**Products are fetched with one `$in` query, and missing products reject the whole order.**
Looking up each product separately would cause N+1 queries. Fetching them together is one round trip, and if any requested product does not exist the order is rejected instead of being created partially.

**Authorization happens at two levels.**
The `whosCan` middleware handles route-level permissions, such as owner-only endpoints. Ownership checks (is this order yours?) live inside the controller, because they depend on the order's data, which is only available after the query runs.

**Centralized error handling.**
Controllers are wrapped with an async wrapper that forwards errors to a single global handler. It formats `AppError` responses and turns Mongoose cast errors (such as a malformed id) into a clear message instead of leaking raw database errors.

## Project Structure

```
controllers/   request handling logic
middleware/    asyncWrapper, verifyToken, whoCan
model/         Mongoose schemas (users, products, orders)
routes/        route definitions
utils/         AppError, token generation, role constants, ownership check
app.js         app setup and error handler
```

## Roadmap

- Stock management for products
- Input validation layer (Joi or express-validator)
- Pagination for product and order lists
- Automated tests
