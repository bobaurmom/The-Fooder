import { useState } from 'react';
import { FiSliders, FiX, FiMapPin, FiDollarSign } from 'react-icons/fi';

export default function Filter({ onApply, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [distance, setDistance] = useState(10);
  const [maxBudget, setMaxBudget] = useState(50);

  const handleApply = () => {
    onApply({ distance, maxBudget });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDistance(10);
    setMaxBudget(50);
    onReset();
    setIsOpen(false);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FiSliders className="w-5 h-5" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Distance Slider */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Distance</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>1 km</span>
                  <span className="font-medium text-gray-900">{distance} km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Max Budget Slider */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <FiDollarSign className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Max Price</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={maxBudget}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 0 && value <= 100) {
                        setMaxBudget(value);
                      }
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-xs text-gray-500">Or use slider ($0 - $100)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
