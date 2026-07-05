import { Search, SlidersHorizontal } from 'lucide-react'

export default function SearchBar({ onFilterClick }) {
  return (
    <div className="flex items-center gap-3 px-5 mt-5">
      <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-sm">
        <Search size={18} className="text-neutral-400" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
        />
      </div>
      <button
        onClick={onFilterClick}
        aria-label="Filters"
        className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition"
      >
        <SlidersHorizontal size={18} />
      </button>
    </div>
  )
}
