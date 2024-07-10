# Flat Share Application

## Overview

Flat Share Application application provides a platform for managing flat rentals and booking requests. It offers features for users to browse available flats, request bookings, update their profiles, and more.

### Live URL

The live version of the application can be accessed at [Live Demo](https://github.com/toushik018/flat-sharing-backend).

## Features

- Browse available flats with detailed information such as square footage, number of bedrooms, location, rent, etc.
- Request bookings for desired flats.
- Update user profile information including bio, profession, and address.

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

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd assignment-8
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Define the required environment variables (e.g., database connection details, JWT secret).

5. Build the project:

   ```
   npm run build
   ```

6. Start the server:

   ```
   npm run dev
   ```

7. Access the application at `http://localhost:PORT` (replace `PORT` with the port specified in your environment variables).
