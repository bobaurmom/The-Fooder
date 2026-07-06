import { useState, useEffect } from 'react';
import Food from '../components/SwipeDeck';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Fyp() {
	const [foods, setFoods] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filters, setFilters] = useState({ distance: null, maxBudget: null });
    const [searchQuery, setSearchQuery] = useState('');

	const fetchFoods = async (category = null, filterParams = null, search = null) => {
		try {
			setLoading(true);
			setError(null);

			const params = {};
			if (category) {
				params.tag = category;
			}
			if (filterParams?.distance) {
				params.distance = filterParams.distance;
			}
			if (filterParams?.maxBudget !== null) {
				params.maxBudget = filterParams.maxBudget;
			}
			if (search) {
				params.search = search;
			}

			const response = await api.get('/foods', { params });
			setFoods(response.data.foods || []);
		} catch (err) {
			console.error('Error fetching foods:', err);
			setError('Failed to load foods.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFoods(selectedCategory, filters, searchQuery);
	}, [selectedCategory, filters, searchQuery]);

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
		setCurrentIndex(0);
	};

	const handleFilterApply = (filterParams) => {
		setFilters(filterParams);
		setCurrentIndex(0);
	};

	const handleFilterReset = () => {
		setFilters({ distance: null, maxBudget: null });
		setCurrentIndex(0);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		setCurrentIndex(0);
	};
	const handleAddToCart = (food) => {
        const savedCart = localStorage.getItem('fooder_cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        
        // Check if item already exists in cart
		const existingItem = cart.find(item => item.food_id === food.food_id);
		if (existingItem) {
			// Item already in cart, could increment quantity if needed
			console.log('Item already in cart');
			return;
		}
		
		cart.push(food);
		localStorage.setItem('fooder_cart', JSON.stringify(cart));
		console.log('Added to cart:', food.name);
    };

    const handleOrder = (food) => {
        console.log('Ordered:', food.name);
    };

    const handleNextFood = () => {
        if (foods.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % foods.length);
    };

    const handlePreviousFood = () => {
        if (foods.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + foods.length) % foods.length);
    };

    const currentFood = foods[currentIndex];
	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
			<Header 
				onCategoryChange={handleCategoryChange} 
				onFilterApply={handleFilterApply}
				onFilterReset={handleFilterReset}
				onSearch={handleSearch}
			/>
			<div className="pt-24 pb-24 px-4 flex items-center justify-center min-h-screen">
				{loading ? (
					<div className="text-center text-gray-500">Loading foods...</div>
				) : error ? (
					<div className="text-center text-red-500">Error: {error}</div>
				) : currentFood ? (
					<Food
						food={currentFood}
						onAddToCart={handleAddToCart}
						onOrder={handleOrder}
						onNextFood={handleNextFood}
						onPreviousFood={handlePreviousFood}
					/>
				) : (
					<div className="text-center text-gray-500">No foods available</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
