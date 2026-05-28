# Queue Management System API

A backend Queue Management System built using Node.js, Express, and MySQL for AIS integration architecture.

---

# Features

- Generate Queue Number
- Fetch Pending Queues
- Fetch Ongoing Queues
- Call Queue
- Complete Queue
- Authentication Middleware
- Adapter Layer Simulation
- Notification Service Simulation

---

# Tech Stack

- Node.js
- Express.js
- MySQL
- XAMPP
- Postman

---

# System Architecture

Client
↓
Routes
↓
Authentication Middleware
↓
Controllers
↓
Services
(Adapter Layer + Notification Service)
↓
Models
↓
MySQL Database

---

# Base URL

```bash
http://localhost:3000
```

---

# Authentication

Protected routes require:

```text
Authorization: Bearer qms-secret-token
```

---

# API Endpoints

## Generate Queue

```http
POST /queue/generate
```

Body:

```json
{
  "appointment_id": 1
}
```

---

## Get Pending Queues

```http
GET /queue/pending
```

---

## Call Queue

```http
PUT /queue/call/:id
```

Example:

```http
PUT /queue/call/1
```

---

## Get Ongoing Queues

```http
GET /queue/ongoing
```

---

## Complete Queue

```http
PUT /queue/complete/:id
```

Example:

```http
PUT /queue/complete/1
```

---

# AIS Integration

This system integrates with:

- Authentication and Authorization System
- Adapter Layer
- Notification System
- Legacy System Simulation

---

# Developers:

Queue Management System Group:

- Caraig, Mar Franklin I.
- De Castro, Jeric S.
- Villacoba, Jhon Charlie R.

---

## Development notes

- If MySQL is not available the application will automatically fall back to an in-memory store for queues. This is intended for development and testing only — use a real MySQL instance for production.
- Start the API: `node app.js` (runs on port 3000 by default).
- Run the included smoke tests (ensure the server is running):

```powershell
npm run smoke
```

- Postman collection and environment are available at `postman/QueueManagement.postman_collection.json` and `postman/QueueManagement.postman_environment.json`.

### Forcing in-memory mode

If you want to explicitly run the application without any DB connectivity (useful for CI or quick dev checks), set the environment variable `FORCE_IN_MEMORY=true` before starting the server. Example (PowerShell):

```powershell
$env:FORCE_IN_MEMORY = 'true'
node app.js
```

This ensures the app uses the in-memory queue store even if a database connection could be detected.
