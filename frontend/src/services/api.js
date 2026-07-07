import axios from 'axios';

// ─── Axios instance for talking to the backend API ─────────────
// Used by src/hooks/useApi.js. Configure VITE_API_URL in .env.local
// (see .env.example) to point at the backend server.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ─── Shared data & constants ───────────────────────────────────

export const CATEGORIES = ["Burger", "Chicken", "Pizza", "Drinks", "Sides", "Dessert"];

export const ALL_TAGS = ["popular", "bestseller", "spicy", "crispy", "beef", "cheese", "vegan", "new"];

export const salesData = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 41000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 61000 },
  { month: "Jul", revenue: 49000 },
];

export const statsData = [
  { name: "Mon", burgers: 40, pizza: 24, drinks: 35 },
  { name: "Tue", burgers: 55, pizza: 38, drinks: 28 },
  { name: "Wed", burgers: 30, pizza: 45, drinks: 50 },
  { name: "Thu", burgers: 70, pizza: 30, drinks: 40 },
  { name: "Fri", burgers: 65, pizza: 55, drinks: 60 },
  { name: "Sat", burgers: 80, pizza: 70, drinks: 55 },
  { name: "Sun", burgers: 45, pizza: 40, drinks: 35 },
];

export const initialFoods = [
  {
    id: 1,
    name: "Cheeseburger Wendy's",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "Burger",
    tags: ["popular", "beef", "cheese"],
  },
  {
    id: 2,
    name: "Classic Double Burger",
    price: 15.49,
    imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    category: "Burger",
    tags: ["bestseller", "beef"],
  },
  {
    id: 3,
    name: "Spicy Crispy Chicken",
    price: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    category: "Chicken",
    tags: ["spicy", "crispy"],
  },
];

export const ordersData = [
  { id: "ORD-001", customer: "John Smith",   items: "Cheeseburger x2, Fries x1",       total: 32.47, status: "completed", time: "2 min ago" },
  { id: "ORD-002", customer: "Maria Garcia", items: "Spicy Chicken x1, Drink x2",       total: 18.97, status: "pending",   time: "5 min ago" },
  { id: "ORD-003", customer: "Alex Johnson", items: "Double Burger x1, Onion Rings x1", total: 21.48, status: "completed", time: "12 min ago" },
  { id: "ORD-004", customer: "Sarah Lee",    items: "Classic Burger x3",                total: 38.97, status: "pending",   time: "18 min ago" },
  { id: "ORD-005", customer: "Mike Davis",   items: "Combo Meal x2",                    total: 27.98, status: "cancelled", time: "25 min ago" },
];
