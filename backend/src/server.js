
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken } from './middleware/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import foodsRoutes from './routes/foodsRoutes.js';
import swipeRoutes from './routes/swipeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running'
  });
});

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api', foodsRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;