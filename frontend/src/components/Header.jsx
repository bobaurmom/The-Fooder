import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import api from '../services/api';
import Filter from './Filter';

export default function Header({ onCategoryChange, onFilterApply, onFilterReset, onSearch }) {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState(['All']);
  const [loadingTags, setLoadingTags] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('fooder_cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags?type=category');
        setTags(['All', ...response.data.tags]);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setTags(['All']);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (onCategoryChange) {
      onCategoryChange(tag === 'All' ? null : tag);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      {/* Top Navigation Bar */}
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Fooder</h1>
        </div>

        {/* Right-aligned icons */}
        <div className="flex items-center">
          {/* Cart icon */}
          <button
            onClick={() => navigate('/cart')}
            className="text-gray-600 hover:text-gray-900 transition-colors relative mr-3"
          >
            <FiShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User icon */}
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
          />
          <Filter onApply={onFilterApply} onReset={onFilterReset} />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="px-6 py-3 flex gap-2 overflow-x-auto">
        {loadingTags ? (
          <div className="text-sm text-gray-400">Loading tags...</div>
        ) : (
          tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
