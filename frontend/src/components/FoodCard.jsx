import { useState } from 'react';

export default function FoodCard({ food }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {food.image_url && !imageError ? (
        <img
          src={food.image_url}
          alt={food.name}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{food.name}</h3>
        <p className="text-sm text-gray-600">{food.restaurant_name}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-red-500">${food.price}</span>
          <span className="text-sm text-gray-500">
            {food.distance_km !== null && food.distance_km !== undefined 
              ? `${food.distance_km} km` 
              : 'Distance unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
}
