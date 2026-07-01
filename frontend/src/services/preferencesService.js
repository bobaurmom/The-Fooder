import { supabase } from './supabaseClient'

export const saveUserPreferences = async ({
  userId,
  minBudget = 0,
  maxBudget,
  maxDistanceKm,
  distance,
  categories = []
}) => {
  const selectedCategories = Array.isArray(categories) ? categories : []

  const { data, error } = await supabase
    .from('user_preference')
    .insert([
      {
        user_id: userId,
        min_budget: minBudget,
        max_budget: maxBudget,
        max_distance_km: maxDistanceKm ?? distance,
        categories: selectedCategories
      }
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
