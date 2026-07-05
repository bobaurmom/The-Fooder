import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Search, Star } from 'lucide-react'
import foods from '../data/foods'
import { useCart } from '../context/CartContext'

export default function FoodInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const food = foods.find((f) => String(f.id) === id)

  if (!food) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Food not found.
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(food, 1)
    // Stay on the page but let them know it worked — swap for a toast component if you have one.
    navigate('/cart')
  }

  const handleOrderNow = () => {
    // Skip the cart entirely: this one item goes straight to checkout.
    addToCart(food, 1)
    navigate('/payment')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-6">
        <button onClick={() => navigate(-1)} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
        <button aria-label="Search" className="active:scale-90 transition">
          <Search size={20} className="text-neutral-900" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <div className="flex justify-center mt-4">
          <img src={food.image} alt={food.name} className="w-56 h-56 object-cover" />
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mt-4">
          {food.name} <span className="font-normal">{food.restaurant}</span>
        </h1>

        <div className="flex items-center gap-2 mt-2 text-sm text-neutral-600">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          <span className="font-medium">{food.rating}</span>
          <span>—</span>
          <span>{food.prepTime}</span>
        </div>

        <p className="text-sm text-neutral-500 leading-relaxed mt-4">{food.description}</p>
      </div>

      <div className="flex gap-3 px-6 pb-6 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-brand text-white rounded-full py-3.5 text-sm font-semibold shadow-sm active:scale-[0.98] transition"
        >
          Add To Card
        </button>
        <button
          onClick={handleOrderNow}
          className="flex-1 bg-neutral-900 text-white rounded-full py-3.5 text-sm font-semibold active:scale-[0.98] transition"
        >
          ORDER NOW
        </button>
      </div>
    </div>
  )
}
