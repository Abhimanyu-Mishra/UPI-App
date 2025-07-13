#  UPI Backend

A secure ready backend for a UPI-based money transfer app, built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. This backend provides robust authentication, bank account management, and a transaction system with JWT protection and best practices for validation and security.

---

##  Tech Stack
- **NestJS** (Node.js framework)
- **Prisma ORM** (Type-safe DB access)
- **PostgreSQL** (Relational database)
- **JWT Authentication** (Secure route protection)
- **class-validator** (Input validation)

---

##  Project Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd upi-backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.
4. **Run database migrations:**
   ```sh
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```sh
   npm run start:dev
   ```
6. **(Optional) Open Prisma Studio:**
   ```sh
   npx prisma studio
   ```

---

##  .env File Structure

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/upi_db?schema=public
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```



---

##  Folder Structure

- `src/auth/` — Authentication (register, login, JWT, guards)
- `src/accounts/` — Bank account management (create, list, balance)
- `src/transactions/` — Transaction system (send money, status, history)
- `prisma/` — Prisma schema and migrations
- `src/prisma.service.ts` — PrismaService for DB access

---

##  API Documentation

- All endpoints are documented in the included Postman collection:
  - **File:** `https://winter-meadow-94119.postman.co/workspace/Personal-Workspace~fe0945b6-d3f5-40be-b400-98e0b5e57384/collection/26315652-a6068572-98a4-42d0-90b3-eb7de84b1bf2?action=share&creator=26315652`
- Import this collection into Postman to test all APIs easily.

---

##  How to Test APIs

1. **Import the Postman collection** into Postman.
2. **Register a new user** via `/auth/register`.
3. **Login** via `/auth/login` to receive a JWT token.
4. **Use the JWT token** as a Bearer token for all protected routes (e.g., `/accounts`, `/transactions/send`).
5. **Create bank accounts, send money, and view transaction history** using the documented endpoints.

---

##  Extra Notes

- **Prisma** is used for all database access and migrations.
- **Passwords** are securely hashed using **bcrypt**.
- **Sensitive routes** are protected by a JWT Auth Guard.
- **Validation** is enforced using `class-validator` and DTOs.


---

**Happy Coding!** 
