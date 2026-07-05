import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, LocateFixed, Loader2 } from 'lucide-react'

const typeOptions = ['Burger', 'Pizza', 'Chicken', 'Drinks', 'Dessert']
const dietOptions = ['Halal Food', 'Vegetarian', 'Vegan']
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Nearest']

function Toggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        active ? 'bg-brand text-white shadow-sm' : 'bg-white text-neutral-500'
      }`}
    >
      {label}
    </button>
  )
}

export default function Filter() {
  const navigate = useNavigate()

  const [types, setTypes] = useState([])
  const [diets, setDiets] = useState([])
  const [maxPrice, setMaxPrice] = useState(50)
  const [sort, setSort] = useState('Recommended')

  // Location filter
  const [locationText, setLocationText] = useState('')
  const [coords, setCoords] = useState(null) // { lat, lng } once detected
  const [radius, setRadius] = useState(5) // km
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Your browser does not support location detection.')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationText('Current location')
        setLocating(false)
      },
      (err) => {
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Type an area instead.'
            : 'Could not detect your location. Try again or type an area.'
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const toggleFrom = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const handleReset = () => {
    setTypes([])
    setDiets([])
    setMaxPrice(50)
    setSort('Recommended')
    setLocationText('')
    setCoords(null)
    setRadius(5)
    setLocationError(null)
  }

  const handleApply = () => {
    // Wire this up to your real query/search call, e.g.
    // navigate(`/?type=${types.join(',')}&diet=${diets.join(',')}&maxPrice=${maxPrice}
    //   &minRating=${minRating}&sort=${sort}
    //   &lat=${coords?.lat ?? ''}&lng=${coords?.lng ?? ''}&radius=${radius}&area=${locationText}`)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-6">
        <button onClick={() => navigate(-1)} aria-label="Back" className="active:scale-90 transition">
          <ArrowLeft size={22} className="text-neutral-900" />
        </button>
        <h1 className="text-base font-semibold text-neutral-900">Filters</h1>
        <button onClick={handleReset} className="text-sm text-brand font-medium">
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 mt-6 pb-4">
        {/* Location */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Location</h2>

          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm mb-3">
            <MapPin size={16} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search an area or address"
              value={locationText}
              onChange={(e) => {
                setLocationText(e.target.value)
                setCoords(null) // typing overrides a previously detected pin
              }}
              className="flex-1 outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
            />
          </div>

          <button
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="flex items-center gap-2 text-sm font-medium text-brand disabled:opacity-60"
          >
            {locating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LocateFixed size={16} />
            )}
            {locating ? 'Detecting your location...' : 'Use my current location'}
          </button>

          {locationError && (
            <p className="text-xs text-red-500 mt-2">{locationError}</p>
          )}
          {coords && !locationError && (
            <p className="text-xs text-neutral-400 mt-2">
              Detected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </p>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500">Within</span>
              <span className="text-sm font-semibold text-brand">{radius} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        </section>

        {/* Type */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Type</h2>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((t) => (
              <Toggle key={t} label={t} active={types.includes(t)} onClick={() => toggleFrom(types, setTypes, t)} />
            ))}
          </div>
        </section>

        {/* Diet */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Dietary</h2>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map((d) => (
              <Toggle key={d} label={d} active={diets.includes(d)} onClick={() => toggleFrom(diets, setDiets, d)} />
            ))}
          </div>
        </section>


        {/* Price */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">Max price</h2>
            <span className="text-sm font-semibold text-brand">${maxPrice}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </section>

        {/* Sort */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Sort by</h2>
          <div className="flex flex-col gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left transition ${
                  sort === opt ? 'bg-brand text-white' : 'bg-white text-neutral-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="px-5 pb-6 pt-2">
        <button
          onClick={handleApply}
          className="w-full bg-brand text-white rounded-xl py-3 text-sm font-semibold shadow-sm active:scale-[0.98] transition"
        >
          Apply filters
        </button>
      </div>
    </div>
  )
}
