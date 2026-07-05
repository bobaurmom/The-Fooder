import Header from './Header'
import SearchBar from './SearchBar'
import CategoryPills from './CategoryPills'
import FoodCard from './FoodCard'
import BottomNav from './BottomNav'

export default function HomeScreen({ onProfileClick, onFilterClick }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <Header onProfileClick={onProfileClick} />
        <SearchBar onFilterClick={onFilterClick} />
        <CategoryPills />
        <FoodCard />
      </div>
      <BottomNav onProfileClick={onProfileClick} />
    </div>
  )
}
