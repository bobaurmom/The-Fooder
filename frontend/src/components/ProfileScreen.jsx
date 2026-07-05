import { ArrowLeft, Settings, ChevronRight, LogOut } from 'lucide-react'

function Field({ label, value }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-neutral-400 mb-1 ml-1">{label}</label>
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
        <span className="text-sm text-neutral-800 font-medium">{value}</span>
      </div>
    </div>
  )
}

/**
 * user is a Supabase auth user object: { email, user_metadata: { full_name, address }, ... }
 * Supabase never exposes the raw password, so instead of showing a masked
 * password field, we link out to a "change password" flow.
 */
export default function ProfileScreen({ user, onBack, onLogout, onChangePassword ,onEditProfile}) {
  const name = user.user_metadata?.full_name || 'No name set'
  const address = user.user_metadata?.address || 'No address set'

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="relative bg-gradient-to-br from-brand-light to-brand-dark h-40 rounded-b-[2rem] flex items-center justify-between px-5 pt-6">
          <button onClick={onBack} aria-label="Back" className="text-white active:scale-90 transition">
            <ArrowLeft size={22} />
          </button>
          <button aria-label="Settings" className="text-white active:scale-90 transition">
            <Settings size={22} />
          </button>
        </div>

        <div className="px-6 mt-6">
          <Field label="Name" value={name} />
          <Field label="Email" value={user.email} />
          <Field label="Delivery address" value={address} />

          <button
            onClick={onChangePassword}
            className="w-full flex items-center justify-between py-3 text-sm text-neutral-700"
          >
            Change password
            <ChevronRight size={18} className="text-neutral-400" />
          </button>

          <div className="border-t border-neutral-200 my-2" />

          <button className="w-full flex items-center justify-between py-3 text-sm text-neutral-700">
            Payment Details
            <ChevronRight size={18} className="text-neutral-400" />
          </button>
          <button className="w-full flex items-center justify-between py-3 text-sm text-neutral-700">
            Order history
            <ChevronRight size={18} className="text-neutral-400" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 px-6 pb-6 pt-2">
        
        <button
        onClick={onEditProfile}
        className="flex-1 bg-neutral-900 text-white rounded-xl py-3 text-sm font-semibold active:scale-[0.98] transition"
      >
        Edit Profile
      </button>
        <button
          onClick={onLogout}
          className="flex-1 border-2 border-brand text-brand rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition"
        >
          Log out <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}
