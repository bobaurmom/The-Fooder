import { useEffect, useState } from 'react';
import api from '../services/api';
import { saveUserPreferences } from '../services/preferencesService';
import '../styles/filter.css';

const Filter = () => {
  const [filters, setFilters] = useState({
    minBudget: 0,
    maxBudget: 20,
    distance: 5,
    categories: []
  });

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingPreference, setSavingPreference] = useState(false);
  const [error, setError] = useState('');
  const [preferenceMessage, setPreferenceMessage] = useState('');

  const categories = ['Food', 'Drink', 'Snack'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((item) => item !== category)
          : [...prev.categories, category]
      };
    });
  };

  const fetchFilteredFoods = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/foods/filter', filters);
      setFoods(response.data.foods || []);
    } catch (err) {
      console.log('FILTER ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to fetch foods');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPreference(true);
      setPreferenceMessage('');
      setError('');

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.user_id || storedUser.id;

      if (!userId) {
        setError('Please login before saving preferences');
        return;
      }

      await saveUserPreferences({
        userId,
        minBudget: filters.minBudget,
        maxBudget: filters.maxBudget,
        distance: filters.distance,
        categories: filters.categories
      });

      setPreferenceMessage('Preferences saved');
    } catch (err) {
      console.log('SAVE PREFERENCE ERROR:', err.message);
      setError(err.message || 'Failed to save preferences');
    } finally {
      setSavingPreference(false);
    }
  };

  // Auto fetch whenever filters change
  useEffect(() => {
    fetchFilteredFoods();
  }, [filters]);

  return (
    <div className="filter-page">
      <div className="filter-wrapper">
        <h1 className="filter-title">Choose Your Preferences</h1>
        <p className="filter-subtitle">
          Select your budget, distance, and category — results update instantly
        </p>

        <div className="filter-card">
          <div className="filter-group">
            <label>Minimum Budget ($)</label>
            <input
              type="number"
              name="minBudget"
              value={filters.minBudget}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Maximum Budget ($)</label>
            <input
              type="number"
              name="maxBudget"
              value={filters.maxBudget}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Distance (km)</label>
            <input
              type="range"
              name="distance"
              min="1"
              max="20"
              value={filters.distance}
              onChange={handleInputChange}
            />
            <span>{filters.distance} km</span>
          </div>

          <div className="filter-group">
            <label>Categories</label>
            <div className="category-options">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`category-btn ${
                    filters.categories.includes(category) ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="category-btn"
            onClick={handleSavePreferences}
            disabled={savingPreference}
          >
            {savingPreference ? 'Saving...' : 'Save Preferences'}
          </button>

          {preferenceMessage && <p>{preferenceMessage}</p>}
        </div>

        <div className="results-section">
          <h2>Results</h2>

          {loading && <p>Loading foods...</p>}
          {error && <p className="filter-error">{error}</p>}

          {!loading && !error && foods.length === 0 && (
            <p>No foods match your filters.</p>
          )}

          <div className="food-list">
            {foods.map((food) => (
              <div className="food-card" key={food.id}>
                {food.image_url && (
                  <img src={food.image_url} alt={food.name} className="food-image" />
                )}
                <h3>{food.name}</h3>
                <p>Category: {food.category}</p>
                <p>Price: ${food.price}</p>
                <p>Distance: {food.distance_km} km</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
