

import { FaHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function FoodCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mx-4 my-2 relative">
      <img
        src="https://via.placeholder.com/300x200.png?text=Cheeseburger"
        alt="Cheeseburger Wendy's Burger"
        className="rounded-lg w-full h-63 object-cover"
      />
      <div className="mt-3 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Cheeseburger Wendy’s Burger</h2>
          <p className="text-yellow-500">⭐ 4.9</p>
          <p className="text-green-600 font-bold">50% discount</p>
          <p className="text-gray-800">$20</p>
        </div>
        <FaHeart className="text-red-500 text-2xl cursor-pointer" />
      </div>
      {/* Arrows for navigation */}
      <FaArrowLeft className="absolute top-1/2 left-2 text-gray-600 text-xl cursor-pointer" />
      <FaArrowRight className="absolute top-1/2 right-2 text-gray-600 text-xl cursor-pointer" />
    </div>
  );
}
