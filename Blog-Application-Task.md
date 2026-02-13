
# 🧩 Blog Application – Task Management Plan

## 1. Overview

This document defines the task breakdown and Jira planning for developing a simple Blog application with production-grade architecture considerations.

Scope includes:

* Authentication (JWT + Refresh Token)
* Post Management (CRUD)
* Search
* Authorization (RBAC)
* Soft Delete
* Audit Logging
* API Versioning

---

# 🏗 Architecture Overview

## Backend

* RESTful API
* JWT Authentication
* Refresh Token Strategy
* Role-Based Access Control (RBAC)
* Soft Delete Strategy
* Audit Logging
* API Versioning `/api/v1`

## Frontend

* SPA (React/Vue/Angular assumed)
* Protected Routes
* Token Management
* Pagination + Search UX
* Error & Loading States

---

# 📌 EPIC 1 – Authentication & Security

---

## BE-01 – Design User Schema & Migration

**Type:** Story
**Team:** Backend
**Priority:** High
**Story Points:** 5

### Description

Create User entity including role support and refresh token storage.

### Schema

* id
* email (unique)
* passwordHash
* role (ADMIN / USER)
* refreshTokenHash
* createdAt
* updatedAt

### Acceptance Criteria

* Unique index on email
* Password hashed (bcrypt)
* Role column with default USER
* Migration script generated

---

## BE-02 – Implement Login API (Access + Refresh Token)

**API**

```
POST /api/v1/auth/login
```

**Story Points:** 8
**Priority:** High

### Response

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Acceptance Criteria

* Validate credentials
* Issue short-lived access token
* Issue long-lived refresh token
* Store hashed refresh token
* Return 401 if invalid

---

## BE-03 – Implement Refresh Token API

**API**

```
POST /api/v1/auth/refresh
```

**Story Points:** 5
**Priority:** High

### Acceptance Criteria

* Validate refresh token
* Issue new access token
* Reject invalid/expired refresh token
* Token rotation supported

---

## FE-01 – Implement Auth Flow

**Team:** Frontend
**Story Points:** 8

### Acceptance Criteria

* Store access token in memory
* Store refresh token securely
* Auto refresh access token
* Logout clears tokens

---

# 📌 EPIC 2 – Post Management

---

## BE-04 – Create Post Entity (Soft Delete Enabled)

**Story Points:** 5
**Priority:** High

### Schema

* id
* title
* content
* authorId
* deletedAt (nullable)
* createdAt
* updatedAt

### Acceptance Criteria

* Soft delete column added
* Default queries exclude deleted posts
* Index on title

---

## BE-05 – Get Posts API (Paginated)

```
GET /api/v1/posts?page=1&limit=10
```

**Story Points:** 5

### Acceptance Criteria

* Exclude soft-deleted records
* Sorted DESC
* Return meta pagination

---

## BE-06 – Get Post By ID

```
GET /api/v1/posts/:id
```

**Story Points:** 3

### Acceptance Criteria

* 404 if not found or soft-deleted
* Return full content

---

## BE-07 – Update Post API (RBAC and Ownership Check)

```
PUT /api/v1/posts/:id
```

**Story Points:** 8

### Acceptance Criteria

* JWT required
* USER can edit own post
* ADMIN can edit any post
* Validation applied
* 403 if unauthorized

---

## BE-08 – Soft Delete Post API

```
DELETE /api/v1/posts/:id
```

**Story Points:** 5

### Acceptance Criteria

* Set deletedAt timestamp
* Only owner or ADMIN allowed
* Post excluded from listing

---

# 📌 EPIC 3 – Search Capability

---

## BE-09 – Search Posts API

```
GET /api/v1/posts/search?keyword=abc&page=1&limit=10
```

**Story Points:** 5

### Acceptance Criteria

* Search title OR content
* Case insensitive
* Indexed column used
* Pagination supported

---

## FE-02 – Implement Search UI

**Story Points:** 5

### Acceptance Criteria

* Debounced input
* Show loading state
* Handle empty results

---

# 📌 EPIC 4 – Role-Based Access Control (RBAC)

---

## BE-10 – Implement Role Guard Middleware

**Story Points:** 5

### Acceptance Criteria

* Middleware validates user role
* ADMIN override allowed
* Reusable decorator pattern

---

# 📌 EPIC 5 – Audit Logging

---

## BE-11 – Implement Audit Log Table

**Story Points:** 5

### Schema

* id
* actionType (CREATE/UPDATE/DELETE)
* entityType (POST)
* entityId
* performedBy
* timestamp

---

## BE-12 – Log Post Update & Delete Actions

**Story Points:** 5

### Acceptance Criteria

* Insert audit log entry on update
* Insert audit log entry on delete
* Include user ID and timestamp

---

# 📌 EPIC 6 – API Hardening & Versioning

---

## BE-13 – Implement API Versioning

**Story Points:** 3

### Requirement

All endpoints under:

```
/api/v1/*
```

---

## BE-14 – Add Security Enhancements

**Story Points:** 5

### Acceptance Criteria

* Rate limit login
* Input validation globally
* CORS configured
* Global exception filter

---

# 📊 Overall Estimation

| Team     | Story Points         | Estimated Duration |
| -------- |----------------------| ------------------ |
| Backend  | ~67 Story Points     | 10–12 days         |
| Frontend | ~25 Story Points     | 5–6 days           |
| Total    | ~92 Story Points     | 2–3 weeks          |

---