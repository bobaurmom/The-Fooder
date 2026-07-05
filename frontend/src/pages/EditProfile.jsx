import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user.user_metadata?.full_name || '')
  const [address, setAddress] = useState(user.user_metadata?.address || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ name, address })
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate('/profile')} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSave} className="flex-1 flex flex-col px-6 mt-6 gap-4">
        {error && (
          <p className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2">{error}</p>
        )}

        <div>
          <label className="block text-xs text-neutral-400 mb-1 ml-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm shadow-sm outline-none"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-1 ml-1">Delivery address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm shadow-sm outline-none"
            placeholder="Your delivery address"
          />
        </div>

        <div className="flex-1" />

        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-white rounded-xl py-3 text-sm font-semibold shadow-sm active:scale-[0.98] transition disabled:opacity-60 mb-6"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}