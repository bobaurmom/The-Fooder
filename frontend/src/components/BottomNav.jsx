
import { useState } from "react";
import { FaShoppingCart, FaUser, FaHome, FaEnvelope, FaHeart } from "react-icons/fa";

export default function BottomNav() {
  const [active, setActive] = useState("home");

  const renderIcon = (name, Icon) => (
    <div
      onClick={() => setActive(name)}
      className={`p-2 rounded-full cursor-pointer ${
        active === name ? "bg-white shadow-lg -mt-6" : ""
      }`}
    >
      <Icon
        className={`text-2xl ${
          active === name ? "text-red-500" : "text-white"
        }`}
      />
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 flex justify-around items-center py-3 rounded-t-3xl shadow-lg">
      {renderIcon("cart", FaShoppingCart)}
      {renderIcon("user", FaUser)}
      {renderIcon("home", FaHome)}
      {renderIcon("messages", FaEnvelope)}
      {renderIcon("favorites", FaHeart)}
    </div>
  );
}
