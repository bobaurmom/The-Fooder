import { useState } from 'react'

const categories = ['All', 'Type', 'Halal Food', 'Fast Food', 'Drinks']

export default function CategoryPills() {
  const [active, setActive] = useState('All')

  return (
    <div className="flex gap-3 px-5 mt-5 overflow-x-auto no-scrollbar pb-1">
      {categories.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-neutral-500'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
