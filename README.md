# The Fooder - Full Stack Web Application

A complete React + Express web application starter kit for building modern web applications.

## 📋 Project Structure

```
the_fooder/
├── backend/               # Express API server
│   ├── src/
│   │   ├── server.js      # Entry point
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utility functions
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/              # React application
│   ├── src/
│   │   ├── main.jsx       # Entry point
│   │   ├── App.jsx        # Root component
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Global styles
│   ├── public/            # Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml     # Docker compose configuration
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables in `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

### Setup Frontend

1. In a new terminal, navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

## 🐳 Docker Setup

Run everything with Docker Compose:

```bash
docker-compose up
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend app on port 5173

## 📁 Backend

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (hot reload)
- `npm test` - Run tests

### Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin requests
- **bcryptjs** - Password hashing

### Key Features

- Error handling middleware
- JWT authentication
- Input validation
- CORS configuration
- Environment-based configuration

## 🎨 Frontend

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client

### Key Features

- Component-based architecture
- Reusable custom hooks
- API service layer with interceptors
- Global styling with CSS variables
- Responsive design ready

## 🔄 API Integration

The frontend is pre-configured to communicate with the backend API. The API client is located in `frontend/src/services/api.js` with:

- Automatic token injection
- Request/response interceptors
- Error handling
- Base URL configuration

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/the-fooder
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=The Fooder
```

## 📦 Adding New Features

### Add a Backend Route

1. Create controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Import and use route in `backend/src/server.js`

### Add a Frontend Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Create API calls using `frontend/src/services/api.js`

### Add Database Model

1. Create schema in `backend/src/models/`
2. Use in controllers with Mongoose operations

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Git Workflow

The `.gitignore` file is configured to exclude:
- node_modules
- Environment files (.env)
- Build outputs
- IDE configurations
- OS-specific files

## 🛠️ Troubleshooting

### Backend not connecting to MongoDB
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### CORS errors
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Check both applications are running on configured ports

### Frontend API calls failing
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check browser console for detailed errors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 📄 License

ISC

## 👨‍💻 Development Tips

1. Use `npm run dev` for development with hot reload
2. Check console logs in both frontend and backend for debugging
3. Use React DevTools and Redux DevTools browser extensions
4. Keep API endpoints RESTful and descriptive
5. Write reusable components
6. Use environment variables for configuration

---

Happy coding! 🎉
