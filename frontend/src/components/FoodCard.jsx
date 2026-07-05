import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
import foods from '../data/foods'
import { useFavorites } from '../context/FavoritesContext'

export default function FoodCard() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const food = foods[index]
  const liked = isFavorite(food.id)

  const next = (e) => {
    e.stopPropagation()
    setIndex((i) => (i + 1) % foods.length)
  }
  const prev = (e) => {
    e.stopPropagation()
    setIndex((i) => (i - 1 + foods.length) % foods.length)
  }

  return (
    <div
      onClick={() => navigate(`/food/${food.id}`)}
      className="mx-5 mt-5 bg-white rounded-3xl shadow-sm p-5 flex-1 cursor-pointer active:scale-[0.99] transition"
    >
      <div className="relative flex items-center justify-center">
        <button
          onClick={prev}
          aria-label="Previous food"
          className="absolute left-0 z-10 w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 active:scale-90 transition"
        >
          <ChevronLeft size={26} />
        </button>

        <img
          src={food.image}
          alt={food.name}
          className="w-56 h-56 object-cover rounded-full"
        />

        <button
          onClick={next}
          aria-label="Next food"
          className="absolute right-0 z-10 w-9 h-9 rounded-full flex items-center justify-center text-neutral-800 active:scale-90 transition"
        >
          <ChevronRight size={26} />
        </button>
      </div>

      <div className="mt-5">
        <p className="text-neutral-900 font-semibold">
          {food.name} <span className="font-normal text-neutral-500">{food.restaurant}</span>
        </p>

        <div className="flex items-center gap-3 mt-2 text-sm">
          <span className="flex items-center gap-1 text-neutral-700 font-medium">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {food.rating}
          </span>
          <span className="text-brand font-medium">{food.discount}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-brand text-2xl font-bold">${food.price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(food)
            }}
            aria-label="Save to favourites"
            className="active:scale-90 transition"
          >
            <Heart
              size={26}
              className={liked ? 'fill-brand text-brand' : 'text-neutral-900'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
