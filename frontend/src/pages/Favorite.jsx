import { useState, useEffect } from 'react';
import Food from '../components/SwipeDeck';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Favorite() {
	const [foods, setFoods] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	const fetchFavorites = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.get('/swipes/favorites');
			console.log('Favorites response:', response.data);
			const favorites = response.data?.favorites || [];
			// Transform to match SwipeDeck expected structure
			const transformedFoods = favorites.map(fav => ({
				...fav,
				gallery: fav.image_url ? [fav.image_url] : [],
				distance_km: null,
			}));
			setFoods(transformedFoods);
		} catch (err) {
			console.error('Error fetching favorites:', err);
			setError('Failed to load favorites.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFavorites();
	}, []);

    const handleAddToCart = (food) => {
        const savedCart = localStorage.getItem('fooder_cart');
        const cart = savedCart ? JSON.parse(savedCart) : [];
        
        const existingItem = cart.find(item => item.food_id === food.food_id);
		if (existingItem) {
			console.log('Item already in cart');
			return;
		}
		
		cart.push(food);
		localStorage.setItem('fooder_cart', JSON.stringify(cart));
		console.log('Added to cart:', food.name);
    };

    const handleRemoveFavorite = async (food) => {
        try {
            await api.delete(`/swipes/favorites/${food.food_id}`);
            console.log('Removed from favorites:', food.name);
            // Refresh the favorites list
            fetchFavorites();
            // Adjust current index if needed
            setCurrentIndex((prev) => {
                if (foods.length <= 1) return 0;
                if (prev >= foods.length - 1) return prev - 1;
                return prev;
            });
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
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
		<div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100">
			<Header />
			<div className="pt-24 pb-24 px-4 flex items-center justify-center min-h-screen">
				{loading ? (
					<div className="text-center text-gray-500">Loading favorites...</div>
				) : error ? (
					<div className="text-center text-red-500">Error: {error}</div>
				) : currentFood ? (
					<Food
						food={currentFood}
						onAddToCart={handleAddToCart}
						onOrder={handleRemoveFavorite}
						onNextFood={handleNextFood}
						onPreviousFood={handlePreviousFood}
					/>
				) : (
					<div className="text-center text-gray-500">No favorites yet. Start swiping to add foods to your favorites!</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
