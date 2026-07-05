import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'fooder_cart'

export function CartProvider({ children }) {
  // Each item: { id, food, qty, selected }
  // `id` here is a cart-line id (so the same food added twice makes one line
  // with qty 2, rather than two separate lines).
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (food, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.food.id === food.id)
      if (existing) {
        return prev.map((line) =>
          line.food.id === food.id ? { ...line, qty: line.qty + qty } : line
        )
      }
      return [...prev, { id: crypto.randomUUID(), food, qty, selected: true }]
    })
  }

  const updateQty = (lineId, qty) => {
    if (qty < 1) return
    setItems((prev) => prev.map((line) => (line.id === lineId ? { ...line, qty } : line)))
  }

  const removeFromCart = (lineId) => {
    setItems((prev) => prev.filter((line) => line.id !== lineId))
  }

  const toggleSelected = (lineId) => {
    setItems((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, selected: !line.selected } : line))
    )
  }

  const allSelected = items.length > 0 && items.every((line) => line.selected)

  const toggleSelectAll = () => {
    const next = !allSelected
    setItems((prev) => prev.map((line) => ({ ...line, selected: next })))
  }

  const selectedItems = items.filter((line) => line.selected)

  const subtotal = selectedItems.reduce((sum, line) => sum + line.food.price * line.qty, 0)

  const clearSelected = () => {
    setItems((prev) => prev.filter((line) => !line.selected))
  }

  const value = {
    items,
    addToCart,
    updateQty,
    removeFromCart,
    toggleSelected,
    allSelected,
    toggleSelectAll,
    selectedItems,
    subtotal,
    clearSelected,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
