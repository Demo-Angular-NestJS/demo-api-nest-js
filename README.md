# NestJS Enterprise Backend

A robust, secure, and highly scalable REST API built with **NestJS**, designed to handle high-concurrency environments with a focus on data integrity and security.

## Technical Architecture & Patterns

This backend follows the **Controller-Service-Repository** pattern, ensuring a clean separation of concerns and high testability.

### Security & Authentication
* **JWT & HttpOnly Cookies:** Implemented a secure authentication flow where the Access Token is stored in an `HttpOnly`, `SameSite: Strict` cookie, mitigating XSS and CSRF attacks.
* **CORS Configuration:** Strict Cross-Origin Resource Sharing (CORS) policies to ensure only authorized frontend domains can interact with the API.
* **Encrypted Payloads:** Standardizing sensitive data handling across all entry points.

### Data Integrity & Validation
* **DTOs (Data Transfer Objects):** Rigorous input definition using `class-validator` and `class-transformer`.
* **Validation Pipes:** Global pipes to ensure all incoming requests are sanitized and validated before reaching the business logic.
* **Mongoose (MongoDB):** Advanced schema modeling with indexes for optimized query performance and data consistency.

### Advanced API Features
* **Idempotency Logic:** Custom implementation to handle duplicate requests. Using a unique `X-Idempotency-Key`, the server ensures that retrying a failed network request doesn't result in duplicate database entries (critical for payments/creations).
* **Global Interceptors:** * **Transform Interceptor:** Standardizes all API responses into a consistent JSON format.
    * **Logging Interceptor:** Tracks request latency and performance bottlenecks.
* **Exception Filters:** Centralized error handling to provide clear, developer-friendly error messages without leaking sensitive stack traces.

---

## Folder Structure
```text
src/
├── common/              # Interceptors, Filters, Pipes, Middlewares
├── modules/             # Feature-based modules (Auth, Users, etc.)
│   ├── dto/             # Data Transfer Objects
│   ├── schemas/         # Mongoose Models
│   ├── services/        # Business Logic
│   └── controllers/     # API Endpoints
└── main.ts              # App entry point & Global configs

---

## Contact & Portfolio
I am a Fullstack Developer dedicated to building secure, performant, and user-centric web applications. 

* **GitHub:** [@judeth82](https://github.com/judeth82)
* **LinkedIn:** [Abel Judeth Cota Nevarez](www.linkedin.com/in/abel-cota)

---
*This project was built to demonstrate proficiency in modern Angular ecosystems and enterprise security standards.*
