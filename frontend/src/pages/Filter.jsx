import { useEffect, useState } from "react";
import api from "../services/api";
import { FaSearch, FaSlidersH } from "react-icons/fa";

export default function Filter() {
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 20,
    distance: 5,
    categories: [],
  });

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false); // toggle panel

  const categories = ["Food", "Drink", "Snack"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((item) => item !== category)
          : [...prev.categories, category],
      };
    });
  };

  const fetchFilteredFoods = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/foods/filter", filters);
      setFoods(response.data.foods || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredFoods();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Fooder</h1>
        <p className="text-sm text-gray-500">Order your favourite food!</p>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center flex-1 px-3 py-2 border rounded-lg bg-gray-100">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          <button
            className="p-2 bg-red-500 rounded-lg text-white"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <FaSlidersH />
          </button>
        </div>
      </div>

      {/* Filter Panel (toggle) */}
      {showFilters && (
        <div className="p-4 bg-white shadow mt-2 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>

          <div className="mb-3">
            <label className="block text-sm">Minimum Budget ($)</label>
            <input
              type="number"
              name="minBudget"
              value={filters.minBudget}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm">Maximum Budget ($)</label>
            <input
              type="number"
              name="maxBudget"
              value={filters.maxBudget}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm">Distance (km)</label>
            <input
              type="range"
              name="distance"
              min="1"
              max="20"
              value={filters.distance}
              onChange={handleInputChange}
              className="w-full"
            />
            <span>{filters.distance} km</span>
          </div>

          <div className="mb-3">
            <label className="block text-sm">Categories</label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`px-3 py-1 rounded-full ${
                    filters.categories.includes(category)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">Results</h2>

        {loading && <p>Loading foods...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && foods.length === 0 && (
          <p>No foods match your filters.</p>
        )}

        <div className="grid gap-4">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              {food.image_url && (
                <img
                  src={food.image_url}
                  alt={food.name}
                  className="rounded-lg w-full h-40 object-cover mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{food.name}</h3>
              <p className="text-sm text-gray-600">Category: {food.category}</p>
              <p className="text-sm text-gray-600">Price: ${food.price}</p>
              <p className="text-sm text-gray-600">
                Distance: {food.distance_km} km
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
