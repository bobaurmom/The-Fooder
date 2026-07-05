import { useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Home, MessageCircle, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function BottomNav({ onProfileClick }) {
  const navigate = useNavigate()
  const { items } = useCart()
  const cartCount = items.reduce((sum, line) => sum + line.qty, 0)

  return (
    <div className="relative bg-brand rounded-t-[2rem] px-8 pt-4 pb-6 flex items-center justify-between">
      <button
        onClick={() => navigate('/cart')}
        aria-label="Cart"
        className="relative text-white/90 active:scale-90 transition"
      >
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-brand text-[10px] font-bold w-4 h-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Same profile logic as the header button */}
      <button
        onClick={onProfileClick}
        aria-label="Profile"
        className="text-white/90 active:scale-90 transition"
      >
        <User size={22} />
      </button>

      {/* Floating home button */}
      <button
        onClick={() => navigate('/')}
        aria-label="Home"
        className="text-white/90 active:scale-90 transition"
      >
        <Home size={22} className="text-white" />
      </button>

      <button aria-label="Messages" className="text-white/90 active:scale-90 transition mr-2">
        <MessageCircle size={22} />
      </button>

      <button
        onClick={() => navigate('/favorites')}
        aria-label="Favourites"
        className="text-white/90 active:scale-90 transition"
      >
        <Heart size={22} />
      </button>
    </div>
    
    // <div className="fixed bottom-0 left-0 right-0 bg-brand py-3 flex items-center justify-around shadow-md">
    //   <button
    //     onClick={() => navigate('/cart')}
    //     aria-label="Cart"
    //     className="relative text-white/90 active:scale-90 transition"
    //   >
    //     <ShoppingCart size={22} />
    //     {cartCount > 0 && (
    //       <span className="absolute -top-2 -right-2 bg-white text-brand text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
    //         {cartCount}
    //       </span>
    //     )}
    //   </button>

    //   <button
    //     onClick={onProfileClick}
    //     aria-label="Profile"
    //     className="text-white/90 active:scale-90 transition"
    //   >
    //     <User size={22} />
    //   </button>

    //   <button
    //     onClick={() => navigate('/')}
    //     aria-label="Home"
    //     className="text-white/90 active:scale-90 transition"
    //   >
    //     <Home size={22} />
    //   </button>

    //   <button aria-label="Messages" className="text-white/90 active:scale-90 transition">
    //     <MessageCircle size={22} />
    //   </button>

    //   <button
    //     onClick={() => navigate('/favorites')}
    //     aria-label="Favourites"
    //     className="text-white/90 active:scale-90 transition"
    //   >
    //     <Heart size={22} />
    //   </button>
    // </div>
  )
}
