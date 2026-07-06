
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from '../supabaseClient.js';
import { verifyToken } from './middleware/authMiddleware.js';
import swipeRoutes from './routes/swipeRoutes.js';

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

/* =========================
   FOODS ROUTES
========================= */
app.get('/api/tags', async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Type parameter is required' });
    }

    if (type === 'category') {
      const { data, error } = await supabase
        .from('tags')
        .select('tag_name')
        .eq('tag_type', 'category');

      console.log('TAGS DATA:', data);
      console.log('TAGS ERROR:', error);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Extract tag names
      const tagNames = data.map(item => item.tag_name);
      
      console.log('TAG NAMES:', tagNames);
      
      return res.json({
        tags: tagNames
      });
    }

    return res.status(400).json({ error: 'Invalid type parameter' });
  } catch (error) {
    console.error('GET TAGS ERROR:', error);
    return res.status(500).json({
      error: 'Failed to fetch tags'
    });
  }
});

app.get('/api/foods', async (req, res) => {
  try {
    const { lat, lng, tag, distance, maxBudget, search } = req.query;

    let foods;

    // If user location is provided, use the RPC function to calculate distances
    if (lat && lng) {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_foods_with_distance', {
        user_lat: parseFloat(lat),
        user_lng: parseFloat(lng)
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        return res.status(400).json({ error: rpcError.message });
      }

      foods = rpcData;
    } else {
      // Fallback: fetch all foods without distance calculation
      let query = supabase
        .from('food_items')
        .select(`
          *,
          restaurants (
            name,
            address
          ),
          food_tags (
            tags (
              tag_name,
              tag_type
            )
          )
        `)
        .eq('is_available', true);

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Filter by category/tag if provided
      let filteredData = data;
      if (tag) {
        filteredData = data.filter(food =>
          food.food_tags?.some(ft => ft.tags?.tag_name === tag && ft.tags?.tag_type === 'category')
        );
      }

      // Filter by search query if provided
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(food =>
          food.name?.toLowerCase().includes(searchLower) ||
          food.description?.toLowerCase().includes(searchLower) ||
          food.restaurants?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by max budget if provided
      if (maxBudget !== undefined) {
        console.log('Filtering by maxBudget:', maxBudget);
        filteredData = filteredData.filter(food => {
          const price = parseFloat(food.price);
          const max = parseFloat(maxBudget);
          console.log(`Food: ${food.name}, Price: ${price}, Max: ${max}, Pass: ${price <= max}`);
          return price <= max;
        });
      }

      // Transform data to match frontend expectations with null distance
      foods = filteredData.map(food => ({
        food_id: food.food_id,
        name: food.name,
        description: food.description,
        image_url: food.image_url,
        price: food.price,
        distance_km: null, // No location data available
        restaurant_name: food.restaurants?.name || 'Restaurant',
        restaurant_address: food.restaurants?.address || 'Address not available',
        gallery: [food.image_url]
      }));
    }

    // Filter by distance if provided and location data is available
    if (distance && foods.some(f => f.distance_km !== null)) {
      const maxDistance = parseFloat(distance);
      foods = foods.filter(food => food.distance_km <= maxDistance);
    }

    // Filter by max budget if provided (for RPC data with location)
    if (maxBudget !== undefined && lat && lng) {
      foods = foods.filter(food => {
        const price = parseFloat(food.price);
        const max = parseFloat(maxBudget);
        return price <= max;
      });
    }

    // Transform data to match frontend expectations
    const transformedFoods = foods.map(food => ({
      food_id: food.food_id,
      name: food.name,
      description: food.description,
      image_url: food.image_url,
      price: food.price,
      distance_km: food.distance_km !== null ? Number(food.distance_km.toFixed(1)) : null,
      restaurant_name: food.restaurant_name || 'Restaurant',
      restaurant_address: food.restaurant_address || 'Address not available',
      gallery: [food.image_url]
    }));

    return res.json({
      foods: transformedFoods
    });
  } catch (error) {
    console.error('GET FOODS ERROR:', error);
    return res.status(500).json({
      error: 'Failed to fetch foods'
    });
  }
});

/* =========================
   SWIPE ROUTES
========================= */
app.use('/api/swipes', swipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.post('/api/foods/filter', async (req, res) => {
  try {
    const { minBudget, maxBudget, distance, categories } = req.body;

    let query = supabase
      .from('foods')
      .select('*')
      .gte('price', minBudget || 0)
      .lte('price', maxBudget || 999999)
      .lte('distance_km', distance || 999999);

    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      foods: data
    });
  } catch (error) {
    console.error('FILTER ERROR:', error);
    return res.status(500).json({
      error: 'Failed to filter foods'
    });
  }
});

export default app;