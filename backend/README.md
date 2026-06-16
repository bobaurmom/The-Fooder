# The Fooder - Backend API

Express.js REST API backend for The Fooder application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Update environment variables in `.env`

4. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` - Health check

## Project Structure

```
src/
├── server.js           # Entry point
├── routes/             # API routes
├── controllers/        # Route handlers
├── models/             # Database models
├── middleware/         # Custom middleware
├── config/             # Configuration files
└── utils/              # Utility functions
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Technologies

- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS enabled
