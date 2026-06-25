// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { verifyToken } from './middleware/authMiddleware.js';
// import { supabase } from '../supabaseClient.js';

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Get __dirname equivalent for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'Server is running', timestamp: new Date() });
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         error: 'email and password are required'
//       });
//     }

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });

//     if (error) {
//       return res.status(401).json({
//         error: error.message,
//         code: error.status || 401
//       });
//     }

//     return res.json({
//       access_token: data.session?.access_token,
//       refresh_token: data.session?.refresh_token,
//       expires_in: data.session?.expires_in,
//       token_type: data.session?.token_type,
//       user: data.user
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({
//       error: 'Login failed'
//     });
//   }
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js';
import { verifyToken } from './middleware/authMiddleware.js';

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
   REGISTER
========================= */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    console.log('REGISTER BODY:', req.body);

    if (!email || !password || !username) {
      return res.status(400).json({
        error: 'Email, password, and username are required'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    console.log('REGISTER DATA:', data);
    console.log('REGISTER ERROR:', error);

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(201).json({
      message: 'Registration successful',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('REGISTER SERVER ERROR:', error);
    return res.status(500).json({
      error: error.message || 'Registration failed'
    });
  }
});

/* =========================
   LOGIN
========================= */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('LOGIN BODY:', req.body);

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('LOGIN DATA:', data);
    console.log('LOGIN ERROR:', error);

    if (error) {
      return res.status(401).json({
        error: error.message
      });
    }

    return res.json({
      message: 'Login successful',
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_in: data.session?.expires_in,
      token_type: data.session?.token_type,
      user: data.user
    });
  } catch (error) {
    console.error('LOGIN SERVER ERROR:', error);
    return res.status(500).json({
      error: error.message || 'Login failed'
    });
  }
});

/* =========================
   PROTECTED USER ROUTE
========================= */
app.get('/api/user', verifyToken, (req, res) => {
  return res.json({
    message: 'Protected route success',
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;