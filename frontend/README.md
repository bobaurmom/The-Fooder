# The Fooder - Frontend

React + Vite frontend for The Fooder application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── main.jsx            # Entry point
├── App.jsx             # Root component
├── components/         # Reusable components
├── pages/              # Page components
├── services/           # API services
├── hooks/              # Custom React hooks
└── styles/             # Global styles
public/
└── index.html          # HTML template
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies

- React 18
- Vite
- React Router
- Axios
