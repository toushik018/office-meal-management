# Office Meal Management System

## Overview

The Office Meal Management System is a platform designed to manage office meal schedules, orders, and user management. It provides features for admins to manage meals, items, and users, while general users can view and manage their meal orders.

### Live URL

The live version of the application can be accessed at [Live Demo](https://github.com/toushik018/office-meal-management).

## Features

- **Authentication**
  - JWT-based authentication
  - Sign-in functionality
  - Banned users cannot log in
- **User Management (Admins Only)**
  - Add and ban users
  - Data table with filters (search, pagination)
  - Update user roles and information
- **Item Management (Admins Only)**
  - Add, update, and delete items
  - Items include food categories such as Protein, Starch, and Veg
- **Meal Management (Admins Only)**
  - Set meals for 5 days a week with constraints
  - Schedule meals for specific days
  - Ensure meals include required items
- **Meal Order Management (General Users)**
  - View weekly meal schedules
  - Select and update meal choices for each day
  - Schedule meals for an entire month
  - Option to select "No Meal" for any day
- **Meal Schedule Management (Admins Only)**
  - View meal choices for every user

## Technology Stack

- **Backend:**
  - Node.js
  - Express.js
  - Prisma ORM for database management
  - JSON Web Tokens (JWT) for authentication
  - Zod for validation

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```sh
   cd office-meal-management
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the required environment variables (e.g., database connection details, JWT secret).

5. Build the project:

   ```sh
   npm run build
   ```

6. Start the server:

   ```sh
   npm run dev
   ```

7. Access the application at `http://localhost:<PORT>` (replace `<PORT>` with the port specified in your environment variables).

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
DATABASE_URL="your-database-url"
JWT_ACCESS_SECRET="your-jwt-access-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
JWT_EXPIRE_IN="your-jwt-expire-time"
JWT_REFRESH_EXPIRE_IN="your-jwt-refresh-expire-time"
PORT=your-port-number
```

## Prisma

Ensure that Prisma is properly set up by running the following command after installing dependencies:

```sh
npx prisma generate
```

To apply any database migrations, run:

```sh
npx prisma migrate dev --name <migration-name>
```

## Scripts

- `npm run dev`: Start the development server with `ts-node-dev`.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run postinstall`: Generate Prisma client after installing dependencies.
- `npm test`: Run tests (currently a placeholder).

## Folder Structure

```
.
├── prisma
│   ├── migrations
│   └── schema.prisma
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── validation
├── .env
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

