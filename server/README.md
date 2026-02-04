# Backend Server

Express.js + PostgreSQL backend for Envelope Budgeting App.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Database Setup**
    Ensure PostgreSQL is running.
    ```bash
    createdb pern_boilerplate
    ```
    *(If database already exists, you can skip this)*

3.  **Apply Schema**
    This command wipes the existing data and applies the new schema.
    ```bash
    npm run db:reset
    ```

4.  **Run Server**
    ```bash
    npm run dev
    ```

## API V1

Base URL: `/api/v1`

- `GET /envelopes`
- `POST /envelopes`
- `PATCH /envelopes/:id`
- `POST /envelopes/:id/spend`
- `POST /income`
