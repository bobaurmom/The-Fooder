

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import BottomNav from "../components/BottomNav";
import api from "../services/api";
import FoodCard from "../components/FoodCart";
import Filter from "./Filter";

export default function Home() {
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 20,
    distance: 5,
    categories: [],
  });
  const [foods, setFoods] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // toggle panel

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.post("/foods/filter", filters);
      setFoods(response.data.foods || []);
    };
    fetchFoods();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Navbar with filter button toggle */}
      <Navbar onFilterClick={() => setShowFilters((prev) => !prev)} />
      
      <CategoryFilter />
       <FoodCard/>
      {/* Filter panel appears when button clicked */}
      {showFilters && (
        <Filter filters={filters} setFilters={setFilters} />
      )}

      {/* Food results */}
      <div className="px-4 mt-4 grid gap-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
