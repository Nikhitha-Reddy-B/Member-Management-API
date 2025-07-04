# Member Management & Task Export API

A full-featured Node.js + Express + TypeScript + Sequelize + PostgreSQL API for managing Members, Roles, and Tasks, with additional support for exporting data to Excel using a dedicated gRPC-based microservice.

---

##  Features

- Add, update, delete, and view members
- Assign and update roles for members (many-to-many relationship)
- View all roles for a member or all members for a role
- Validation using Joi
- Sequelize ORM with UUIDs
- PostgreSQL for database
- TypeScript for type safety
- Clean folder structure 
- JWT-based login API for authentication
- Role-based authorization using middleware to restrict access
  based on user roles (Super Admin, Admin, User)
- API documentation using Swagger (OpenAPI)
- Unit testing implemented using Jest to validate service layer logic with mocked Sequelize models
- Task Management: Create, update, assign, and track tasks
- Profile Picture Upload: Upload one profile photo per member (auto-compress if size > 25MB)
- Export data to Excel (Members, Tasks, Members with Tasks) using a separate gRPC export server
---

##  Tech Stack

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- node-watch
- Jest
- gRPC
- ExcelJS
  
---
##  Project Structure

```
├── src/
│   ├── config/              # Database configuration
│   ├── controllers/         # Express route handlers
│   ├── middleware/          # Authorization middleware
│   ├── models/              # Sequelize models (Member, Role, MemberRole)
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── types/               # Type definitions (interfaces, payloads, etc.)
│   ├── validations/         # Joi schemas and validation logic
│   ├── utils/               # Utility functions (e.g., image compression)
│   ├── watch.ts             # Watcher entry file for node-watch
│   └── index.ts             # Application entry point
├── export-server/           # Separate service for export (runs on different port)
│   ├── types/               # Types and proto-related definitions for export server
│   ├── service/             # Logic to generate Excel files
│   ├── exports/             # Folder where generated Excel files are saved
│   └── server.ts            # Entry point to start export gRPC server
├── proto/                   # gRPC proto file that defines messages and service structure
├── tests/                   # Unit tests written with Jest
│   └── services/            # Test cases for service layer (roles, members)
├── jest.config.js           # Jest configuration
├── .env                     # Environment variables
├── package.json             # Scripts and dependencies
├── swagger.json             # Swagger API documentation
├── tsconfig.json            # TypeScript compiler options
├── .gitignore               # Git ignore rules
```

## Installation

```bash
git clone https://github.com/NikhithaReddy8/Member-Management-API.git
cd Member-Management-API
npm install
```

## Setup

Create a .env file in the root directory with the following content:

```bash
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_super_key
```

## Running locally

To run the unit tests:

```bash
npm run test
```
To build and start the main server:

```bash
npm run watch
```
The server will be running on:

```bash
http://localhost:4000
```
- You can now access the API endpoints (e.g., /members) at this address.
- You can now access the API documentation at /api-docs at this address.

If want to use the export feature:

Add terminal, change the directory to the export-server folder:

```bash
cd export-server
```

Then start the export server:

```bash
npm run watch
```

The export server will run on:

```bash
http://localhost:4040
```
- After starting the export server, main server can handle export requests successfully.
