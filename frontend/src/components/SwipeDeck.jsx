import { useMemo, useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaUtensils, FaHeart } from 'react-icons/fa';
import '../styles/fyp.css';


export default function Food({ food = fallbackFood, onAddToCart, onOrder, onNextFood, onPreviousFood }) {
	const mergedFood = useMemo(
		() => ({
			...food
		}),
		[food],
	);

	const [imageIndex, setImageIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [showHeart, setShowHeart] = useState(false);
	const [showCart, setShowCart] = useState(false);
	const [slideDirection, setSlideDirection] = useState(null);
	const [lastClickTime, setLastClickTime] = useState(0);

	// Reset states when food changes
	useEffect(() => {
		setImageIndex(0);
		setIsFlipped(false);
		setShowHeart(false);
		setShowCart(false);
		setSlideDirection(null);
	}, [food]);

	const currentImage = mergedFood.gallery[imageIndex % mergedFood.gallery.length];
	const price = Number(mergedFood.price || 0).toFixed(2);
	const distanceDisplay = mergedFood.distance_km !== null ? `${mergedFood.distance_km} km` : 'Location not available';

	const goToPreviousImage = () => {
		setImageIndex((current) => (current - 1 + mergedFood.gallery.length) % mergedFood.gallery.length);
		setIsFlipped(false);
	};

	const goToNextImage = () => {
		setImageIndex((current) => (current + 1) % mergedFood.gallery.length);
		setIsFlipped(false);
	};

	const handleCardClick = () => {
		const currentTime = Date.now();
		const timeDiff = currentTime - lastClickTime;

		if (timeDiff < 300) {
			// Double click detected - show heart and add to favorite
			setShowHeart(true);
			setTimeout(() => {
				setShowHeart(false);
			}, 600);
		} else {
			// Single click - flip card
			if (!isFlipped) {
				setIsFlipped(true);
			}
		}

		setLastClickTime(currentTime);
	};

	const handleSwipeLeft = () => {
		setSlideDirection('left');
		setTimeout(() => {
			if (onPreviousFood) {
				onPreviousFood();
			}
			setSlideDirection(null);
		}, 300);
	};

	const handleSwipeRight = () => {
		setSlideDirection('right');
		setTimeout(() => {
			if (onNextFood) {
				onNextFood();
			}
			setSlideDirection(null);
		}, 300);
	};

	const handleAddToCart = () => {
		if (onAddToCart) {
			onAddToCart(mergedFood);
			setShowCart(true);
			setTimeout(() => {
				setShowCart(false);
			}, 600);
		}
	};

	const handleOrder = () => {
		if (onOrder) {
			onOrder(mergedFood);
			setShowHeart(true);
			setTimeout(() => {
				setShowHeart(false);
			}, 600);
		}
	};

	return (
		<div className="swipe-card-container">
			<button
				type="button"
				className="swipe-arrow-external swipe-arrow-left-external"
				onClick={handleSwipeLeft}
				aria-label="Swipe left to next food"
			>
				<FaArrowLeft />
			</button>

			<div className="swipe-card-shell">
				<div className={`swipe-card ${isFlipped ? 'is-flipped' : ''} ${slideDirection ? `slide-${slideDirection}` : ''}`}>
					{showHeart && <div className="heart-pop"><FaHeart /></div>}
					{showCart && <div className="cart-pop"><FaShoppingCart /></div>}
					<div className="swipe-card-face swipe-card-front" onClick={handleCardClick}>
						<div className="swipe-card-media">
							<img src={currentImage} alt={mergedFood.name} className="swipe-card-image" />
							<div className="swipe-card-badge">{distanceDisplay} away</div>
						</div>

						<div className="swipe-card-content">
							<div className="swipe-card-heading-row">
								<div>
									<h3>{mergedFood.name}</h3>
								</div>
								<div className="swipe-card-price">${price}</div>
							</div>

							<div className="swipe-card-meta">
								<span>{distanceDisplay}</span>
							</div>
						</div>
					</div>

					<div className="swipe-card-face swipe-card-back">
						<div className="swipe-card-back-top">
							<p className="swipe-card-kicker">Restaurant info</p>
							<h3>{mergedFood.restaurant_name || 'Restaurant details'}</h3>
							<p>{mergedFood.restaurant_address || 'Restaurant address not available'}</p>
						</div>

						<div className="swipe-card-back-panel">
							<div>
								<span className="back-label">Food name</span>
								<strong>{mergedFood.name}</strong>
							</div>
							<div>
								<span className="back-label">Price</span>
								<strong>${price}</strong>
							</div>
							<div>
								<span className="back-label">Distance</span>
								<strong>{distanceDisplay}</strong>
							</div>
						</div>

						<div className="swipe-card-actions back-actions">
							<button type="button" className="swipe-action-button secondary" onClick={handleAddToCart}>
								<FaShoppingCart /> Add to cart
							</button>
							<button type="button" className="swipe-action-button favorite" onClick={handleOrder}>
								Favorite
							</button>
						</div>

						<button type="button" className="swipe-card-back-return" onClick={() => setIsFlipped(false)}>
							<FaArrowLeft /> Back to food
						</button>
					</div>
				</div>
			</div>

			<button
				type="button"
				className="swipe-arrow-external swipe-arrow-right-external"
				onClick={handleSwipeRight}
				aria-label="Swipe right to like and view details"
			>
				<FaArrowRight />
			</button>
		</div>
	);
}
