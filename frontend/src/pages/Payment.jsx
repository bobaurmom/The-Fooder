import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

const DELIVERY_FEE = 1.5

const paymentMethods = [
  {
    id: 'mastercard',
    label: 'Credit card',
    last4: '0505',
    masked: '5105 **** **** 0505',
    brand: 'MasterCard',
    style: 'bg-neutral-900 text-white',
  },
  {
    id: 'visa',
    label: 'Debit card',
    last4: '0505',
    masked: '3566 **** **** 0505',
    brand: 'VISA',
    style: 'bg-neutral-100 text-neutral-900',
  },
]

export default function Payment() {
  const navigate = useNavigate()
  const { selectedItems, subtotal, clearSelected } = useCart()

  const [selectedMethod, setSelectedMethod] = useState('mastercard')
  const [saveCard, setSaveCard] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const total = subtotal + DELIVERY_FEE

  const handlePayNow = () => {
    // Wire this up to your real payment provider (Stripe, etc).
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setShowSuccess(true)
    }, 900)
  }

  const handleGoBack = () => {
    clearSelected() // the items just paid for leave the cart
    setShowSuccess(false)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between px-5 pt-6">
        <button onClick={() => navigate(-1)} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
        <button aria-label="Search" className="active:scale-90 transition">
          <Search size={20} className="text-neutral-900" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 mt-2">
        <h1 className="text-lg font-semibold text-neutral-900 mb-3">Order summary</h1>

        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Order</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Delivery fees</span>
          <span>${DELIVERY_FEE.toFixed(2)}</span>
        </div>

        <div className="border-t border-neutral-200 my-3" />

        <div className="flex justify-between text-sm font-semibold text-neutral-900 mb-1">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-neutral-400">Estimated delivery time: 15 - 30mins</p>

        <h2 className="text-base font-semibold text-neutral-900 mt-6 mb-3">Payment methods</h2>

        <div className="flex flex-col gap-3">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethod(m.id)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-4 text-left transition ${m.style}`}
            >
              <div>
                <p className="text-sm font-medium">{m.brand}</p>
                <p className="text-xs opacity-70 mt-1">
                  {m.label}
                  <br />
                  {m.masked}
                </p>
              </div>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedMethod === m.id
                    ? 'border-brand bg-brand'
                    : 'border-neutral-300'
                }`}
              >
                {selectedMethod === m.id && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600 mt-4">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="w-4 h-4 accent-brand"
          />
          Save card details for future payments
        </label>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 pt-3">
        <div>
          <p className="text-xs text-neutral-400">Total price</p>
          <p className="text-2xl font-bold text-brand">${total.toFixed(2)}</p>
        </div>
        <button
          onClick={handlePayNow}
          disabled={processing || selectedItems.length === 0}
          className="bg-neutral-900 text-white rounded-full px-8 py-3.5 text-sm font-semibold active:scale-[0.98] transition disabled:opacity-60"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      {/* Success popup */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-8">
          <div className="bg-white rounded-3xl px-6 py-8 w-full text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center mx-auto">
              <Check size={30} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-brand text-xl font-bold mt-4">Success !</h2>
            <p className="text-sm text-neutral-500 mt-2">
              Your payment was successful. A receipt for this purchase has been sent to your email.
            </p>
            <button
              onClick={handleGoBack}
              className="w-full bg-brand text-white rounded-full py-3 text-sm font-semibold mt-6 active:scale-[0.98] transition"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
