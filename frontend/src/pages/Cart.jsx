import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const {
    items,
    updateQty,
    toggleSelected,
    allSelected,
    toggleSelectAll,
    selectedItems,
  } = useCart()

  const handleCheckout = () => {
    if (selectedItems.length === 0) return
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

      <div className="flex-1 overflow-y-auto px-5 mt-4">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-400 text-center px-8">
            Your cart is empty. Add something tasty from the home screen!
          </div>
        ) : (
          items.map((line) => (
            <div key={line.id} className="flex items-center gap-3 py-4 border-b border-neutral-100">
              <input
                type="checkbox"
                checked={line.selected}
                onChange={() => toggleSelected(line.id)}
                className="w-4 h-4 accent-brand shrink-0"
              />
              <img
                src={line.food.image}
                alt={line.food.name}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <p className="flex-1 text-sm font-medium text-neutral-900">
                {line.food.name} {line.food.restaurant}
              </p>
              <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-3 py-1.5 shrink-0">
                <button
                  onClick={() => updateQty(line.id, line.qty - 1)}
                  aria-label="Decrease quantity"
                  className="active:scale-90 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold w-4 text-center">{line.qty}</span>
                <button
                  onClick={() => updateQty(line.id, line.qty + 1)}
                  aria-label="Increase quantity"
                  className="active:scale-90 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-neutral-200 px-5 py-4 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-neutral-600 shrink-0">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 accent-brand"
          />
          ALL
        </label>
        <button
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="flex-1 bg-brand text-white rounded-full py-3 text-sm font-semibold shadow-sm active:scale-[0.98] transition disabled:opacity-50"
        >
          Check Out
        </button>
      </div>

      <p className="text-center font-display italic text-lg text-neutral-800 pb-6 pt-2">
        @ The-Fooder
      </p>
    </div>
  )
}
