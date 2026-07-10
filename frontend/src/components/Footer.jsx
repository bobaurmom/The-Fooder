import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Wave SVG for top edge */}
      <svg 
        className="w-full h-8" 
        viewBox="0 0 1440 32" 
        preserveAspectRatio="none"
        style={{ fill: '#DC2626' }}
      >
        <path
          d="M0,16 L120,16 C180,16 180,0 240,0 C300,0 300,16 360,16 C420,16 420,0 480,0 C540,0 540,16 600,16 C660,16 660,0 720,0 C780,0 780,16 840,16 C900,16 900,0 960,0 C1020,0 1020,16 1080,16 C1140,16 1140,0 1200,0 C1260,0 1260,16 1320,16 L1440,16 L1440,32 L0,32 Z"
        />
      </svg>
      
      {/* Footer content */}
      <div className="bg-red-600 px-6 py-4 flex justify-around items-center">
        {/* Cart */}
        <button 
          onClick={() => navigate('/cart')}
          className="flex flex-col items-center text-white hover:text-red-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>

        {/* Profile */}
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center text-white hover:text-red-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>

        {/* Home - Elevated with red circle */}
        <button 
          onClick={() => navigate('/fyp')}
          className="relative -mt-8"
        >
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        </button>

        {/* Messages */}
        <button 
          onClick={() => navigate('/messages')}
          className="flex flex-col items-center text-white hover:text-red-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>

        {/* Favorites */}
        <button 
          onClick={() => navigate('/favorites')}
          className="flex flex-col items-center text-white hover:text-red-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
