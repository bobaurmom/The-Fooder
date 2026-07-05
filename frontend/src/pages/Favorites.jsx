import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Star } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

export default function Favorites() {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useFavorites()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900">Favourites</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 mt-4">
        {favorites.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-400 text-center px-8">
            Tap the heart on any food to save it here.
          </div>
        ) : (
          favorites.map((food) => (
            <div
              key={food.id}
              onClick={() => navigate(`/food/${food.id}`)}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-sm p-3 mb-3 cursor-pointer active:scale-[0.99] transition"
            >
              <img src={food.image} alt={food.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{food.name}</p>
                <p className="text-xs text-neutral-500 truncate">{food.restaurant}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {food.rating}
                </div>
              </div>
              <p className="text-brand font-bold shrink-0">${food.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(food)
                }}
                aria-label="Remove from favourites"
                className="active:scale-90 transition shrink-0"
              >
                <Heart size={20} className="fill-brand text-brand" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
