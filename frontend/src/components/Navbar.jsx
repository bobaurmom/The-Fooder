




import { FaSearch, FaSlidersH, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="p-4 bg-white shadow">
      {/* Title + tagline */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fooder</h1>
          <p className="text-sm text-gray-500">Order your favourite food!</p>
        </div>
        <FaUserCircle className="text-3xl text-gray-600 cursor-pointer" />
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="flex items-center flex-1 px-3 py-2 border rounded-lg bg-gray-100">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none bg-transparent text-sm"
          />
        </div>

        {/* Filter button */}
        <button className="p-2 bg-red-500 rounded-lg text-white">
          <FaSlidersH />
        </button>
      </div>
    </div>
  );
}