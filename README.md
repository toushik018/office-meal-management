# Office Meal Management System - Backend

## Description

This project is the backend service for the Office Meal Management System, built with Node.js, Express, Prisma, and TypeScript. It provides RESTful APIs for managing users, meals, orders, and schedules.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed. You can download them from [Node.js official website](https://nodejs.org/).
- PostgreSQL installed and running. You can download it from [PostgreSQL official website](https://www.postgresql.org/).

## Getting Started

Follow these steps to set up and start the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/toushik018/office-meal-management
cd office-meal-management

```

````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/your-database-name?schema=public"
JWT_ACCESS_SECRET="your-jwt-secret"
EXPIRE_IN="your-expire
PORT=5000
NODE_ENV=production
JWT_ACCESS_SECRET=""
EXPIRE_IN="1d"
JWT_REFRESH_SECRET=""
REFRESH_EXPIRE_IN=""


```

### 4. Set Up Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Run the Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

### 5. Start the Development Server

```bash
npm run dev
```

The backend server should now be running on `http://localhost:5000`.

## Project Structure

- `src/`: Contains the source code for the project.
  - `controllers/`: Handles the request and response logic.
  - `middleware/`: Contains middleware functions for authentication and error handling.
  - `models/`: Defines the Prisma schema and models.
  - `routes/`: Defines the application routes.
  - `services/`: Contains the business logic.
  - `utils/`: Contains utility functions.
- `prisma/`: Contains Prisma schema and migration files.

## Available Scripts

- `npm run dev`: Runs the application in development mode using `ts-node-dev`.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run postinstall`: Runs Prisma generate command after installation.

## Important Notes

- Ensure your PostgreSQL database is running and accessible with the provided credentials in the `.env` file.
- The Prisma client should be generated every time you make changes to the Prisma schema.
- For any email-related features, ensure you have set up the email configurations correctly in the `.env` file.

## Contributing

If you want to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.
