

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-red-600 flex flex-col items-center justify-center cursor-pointer"
      onClick={() => navigate('/login')}
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-8" style={{ fontFamily: 'cursive, script' }}>
          Fooder
        </h1>
        <div className="text-6xl mb-4">
          
        </div>
      </div>
    </div>
  );
}
