# NestJS Enterprise-Grade API

[![NestJS Version](https://img.shields.io/badge/NestJS-v11+-E0234E?style=flat&logo=nestjs)](https://nestjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)](https://mongoosejs.com)
[![Security](https://img.shields.io/badge/Security-OWASP_Aligned-blue)](#security--authentication)

A robust, secure, and highly scalable RESTful API built with **NestJS**. This backend is engineered to handle high-concurrency environments with a focus on **strict data integrity** and **defense-in-depth security**.

---

## Technical Architecture & Patterns

The system follows a modular **Controller-Service-Repository** pattern, promoting high testability, low coupling, and clear separation of concerns.

### Security & Authentication
* **JWT via HttpOnly Cookies:** Implemented a stateless yet secure auth flow using `HttpOnly`, `Secure`, and `SameSite: Strict` cookies to effectively mitigate **XSS** and **CSRF** vulnerabilities.
* **Granular CORS Policy:** Strict Cross-Origin Resource Sharing configuration to whitelist only trusted environments.
* **Request Sanitization:** Automatic stripping of non-whitelisted properties from payloads to prevent **Mass Assignment** attacks using `whitelist: true` in Global Pipes.

### Data Integrity & Validation
* **Strict Type-Safety (DTOs):** Utilizing `class-validator` and `class-transformer` for runtime schema enforcement.
* **Mongoose ODM:** Advanced MongoDB modeling with optimized indexing and automated schema-to-document transformation.
* **Global Validation Pipes:** Unified input validation ensuring that only "clean" data ever reaches the business logic.

### Professional API Features
* **Distributed Idempotency:** Custom logic using a unique `X-Idempotency-Key` header. This prevents duplicate transactions (e.g., accidental double payments or resource creations) during network retries or client-side latency.
* **Global Interceptors:** * **Transform:** Standardizes all API responses into a predictable, unified JSON wrapper.
    * **Logging:** Real-time monitoring of request latency and system performance.
* **Centralized Exception Filters:** Global error handling that maps internal exceptions to clean, user-friendly HTTP responses while securing sensitive stack traces.

---

### Contact & Portfolio
I am a full-stack developer dedicated to building secure, performant, and user-centric web applications. 

* **GitHub:** [@judeth82](https://github.com/judeth82)
* **LinkedIn:** [Abel Judeth Cota Nevarez](www.linkedin.com/in/abel-cota)

---

*This project was built to demonstrate proficiency in modern Angular ecosystems and enterprise security standards.*

---

## 🏗️ Folder Structure

```text
src/
├── common/             # Global Interceptors, Filters, Pipes, and Middlewares
├── modules/            # Domain-driven feature modules
│   ├── [feature]/
│   │   ├── dto/        # Data Transfer Objects & Validation rules
│   │   ├── schemas/    # Mongoose/MongoDB data models
│   │   ├── services/   # Encapsulated Business Logic
│   │   └── controllers/# Request routing & Response handling
└── main.ts             # Application bootstrapping & Global configuration
