import { User } from 'lucide-react'

export default function Header({ onProfileClick }) {
  return (
    <div className="flex items-start justify-between px-5 pt-6">
      <div>
        <h1 className="font-display italic text-3xl text-neutral-900">Fooder</h1>
        <p className="text-neutral-500 text-sm mt-1">Order your favourite food!</p>
      </div>

      {/* Clicking this decides: go to Login/Register, or go to Profile */}
      <button
        onClick={onProfileClick}
        aria-label="Open profile"
        className="w-11 h-11 rounded-full border-2 border-neutral-900 flex items-center justify-center shrink-0 active:scale-95 transition"
      >
        <User size={20} className="text-neutral-900" />
      </button>
    </div>
  )
}
