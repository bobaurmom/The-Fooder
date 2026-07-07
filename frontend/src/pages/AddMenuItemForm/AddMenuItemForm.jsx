import { useState } from "react";
import "./AddMenuItemForm.css";
import { initialFoods, CATEGORIES, ALL_TAGS } from "../../services/api";

/* ─── Food Modal (Add / Edit form) ──────────────────────────── */

function FoodModal({ item, onClose, onSave }) {
  const [name,         setName]         = useState(item?.name      ?? "");
  const [price,        setPrice]        = useState(item?.price?.toString() ?? "");
  const [imageUrl,     setImageUrl]     = useState(item?.imageUrl  ?? "");
  const [category,     setCategory]     = useState(item?.category  ?? CATEGORIES[0]);
  const [selectedTags, setSelectedTags] = useState(item?.tags      ?? []);
  const [error,        setError]        = useState("");

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim())                                          { setError("Name is required.");      return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { setError("Enter a valid price.");   return; }
    if (!imageUrl.trim())                                      { setError("Image URL is required."); return; }
    onSave({ name: name.trim(), price: parseFloat(price), imageUrl: imageUrl.trim(), category, tags: selectedTags });
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        <div className="modal-header">
          <h2>{item?.id ? "Edit Menu Item" : "Add Menu Item"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Cheeseburger Wendy's"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 12.99"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                className="form-input"
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="img-preview"
                  onError={e => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-wrap">
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-btn ${selectedTags.includes(tag) ? "selected" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {item?.id ? "Save Changes" : "Add Food"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

/* ─── Food Card ──────────────────────────────────────────────── */

function FoodCard({ item, index, onEdit, onDelete }) {
  return (
    <div className="food-card">
      <div className="food-card-img-wrap">
        <img
          className="food-card-img"
          src={item.imageUrl}
          alt={item.name}
          onError={e => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop";
          }}
        />
        <span className="food-card-badge">#{String(index + 1).padStart(3, "0")}</span>
        <span className="food-card-cat">{item.category}</span>
      </div>

      <div className="food-card-body">
        <div className="food-card-name">{item.name}</div>
        <div className="food-card-price">${item.price.toFixed(2)}</div>

        {item.tags.length > 0 && (
          <div className="food-card-tags">
            {item.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}

        <div className="food-card-actions">
          <button className="btn-edit"   onClick={() => onEdit(item)}>✏ Edit</button>
          <button className="btn-delete" onClick={() => onDelete(item.id)}>🗑 Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Manage Food Page ───────────────────────────────────────── */

export default function AddMenuItemForm() {
  const [foods,          setFoods]          = useState(initialFoods);
  const [modal,          setModal]          = useState({ open: false, item: null });
  const [search,         setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  function openAdd()      { setModal({ open: true, item: {} }); }
  function openEdit(item) { setModal({ open: true, item }); }
  function closeModal()   { setModal({ open: false, item: null }); }

  function handleSave(data) {
    if (modal.item?.id) {
      setFoods(prev => prev.map(f => f.id === modal.item.id ? { ...f, ...data } : f));
    } else {
      setFoods(prev => [...prev, { ...data, id: Date.now() }]);
    }
    closeModal();
  }

  function handleDelete(id) {
    if (window.confirm("Delete this food item?")) {
      setFoods(prev => prev.filter(f => f.id !== id));
    }
  }

  const displayed = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCategory === "All" || f.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select-input"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button className="btn-add" onClick={openAdd}>+ Add Food</button>
      </div>

      {displayed.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40 }}>📦</div>
          <p>No food items found.</p>
        </div>
      ) : (
        <div className="food-grid">
          {displayed.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              index={foods.indexOf(item)}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modal.open && (
        <FoodModal item={modal.item} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
}
