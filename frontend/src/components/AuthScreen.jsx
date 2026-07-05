import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

/**
 * Presentational login/register form.
 * It no longer talks to any auth service directly — the parent page
 * (src/pages/Login.jsx or src/pages/Register.jsx) passes in:
 *   - mode: 'login' | 'register'
 *   - onSubmit(formValues): called when the form is submitted
 *   - onSwitchMode(): called when the user taps "Register" / "Log in"
 *   - onBack(): called when the back arrow is tapped
 *   - submitting: true while the request is in flight (disables the button)
 *   - error: a message string to show above the form, or null
 */
export default function AuthScreen({ mode, onSubmit, onSwitchMode, onBack, submitting, error, info }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const isLogin = mode === 'login'

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-5 pt-6">
        <button onClick={onBack} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-7 -mt-10">
        <h1 className="font-display italic text-3xl text-neutral-900">Fooder</h1>
        <p className="text-neutral-500 text-sm mt-1 mb-8">
          {isLogin ? 'Log in to your account' : 'Create your account'}
        </p>

        {info && !error && (
          <p className="bg-green-50 text-green-700 text-xs rounded-lg px-3 py-2 mb-4">
            {info}
          </p>
        )}
        {error && (
          <p className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={update('name')}
              className="bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-sm placeholder:text-neutral-400"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            className="bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-sm placeholder:text-neutral-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            className="bg-white rounded-xl px-4 py-3 text-sm outline-none shadow-sm placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-brand text-white rounded-xl py-3 text-sm font-semibold shadow-sm active:scale-[0.98] transition disabled:opacity-60"
          >
            {submitting ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={onSwitchMode} className="text-brand font-semibold">
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}
