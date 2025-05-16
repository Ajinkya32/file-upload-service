# File Upload Service

## Overview

A file upload microservice built with Node.js, Express, Prisma, and BullMQ for background processing.

## Setup

### Local

1. Copy `.env.local.example` to `.env` and fill in values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the server:
   ```bash
   npm start
   or
   npm run dev
   ```
5. In a separate terminal, start the background worker:
   ```bash
   npm run worker
   ```

### Docker

1. Copy `.env.docker.example` to `.env` and fill in values.
2. Create Docker Build:
   ```bash
   docker-compose build
   ```
3. Run docker container:
   ```bash
   docker-compose up -d
   ```

## API Endpoints

- `POST /auth/login`

- `POST /files/upload`

- `GET /files/all` -- Get All Files Uploaded by current User

- `GET /files/:id` -- Get File By Id Uploaded by current User

- `GET /uploads/test.png` -- For File preview with Authentication

## Postman Collection

### Setup

A complete Postman collection and environment is availabe in postmancollection folder.

- Import `File Upload Service.postman_collection.json` into Postman
- Import `File Upload Service Env.postman_environment.json` into Postman
- From the top-right Environment dropdown, choose `File Upload Service Env`.

### Usage

- Required login credentials are already added to the environement unless changed from .env file.
- Once you run Login API, token is set to the environment variable automatically via script.
- For `File preview API`, once file is fetched from `Get File By ID API`, the storagePath from response is automatically set to the filePath variable in env.

## Notes

- Upload size limited to 5MB. Can be changed from ./src/utils/multer.js.
- Admin user seeded from `.env` variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
