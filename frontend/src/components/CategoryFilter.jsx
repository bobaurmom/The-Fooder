export default function CategoryFilter() {
  const categories = ["All", "Type", "Halal Food"];

  return (
    <div className="flex gap-3 px-4 py-2">
      {categories.map((cat, idx) => (
        <button
          key={idx}
          className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

