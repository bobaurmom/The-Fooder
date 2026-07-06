-- Supabase RPC Function: get_foods_with_distance
-- This function calculates the distance between the user's location and each restaurant
-- Returns food items with distance in kilometers (rounded to 1 decimal place)

CREATE OR REPLACE FUNCTION get_foods_with_distance(user_lat FLOAT, user_lng FLOAT)
RETURNS TABLE (
  food_id INTEGER,
  name TEXT,
  description TEXT,
  image_url TEXT,
  price NUMERIC,
  distance_km FLOAT,
  restaurant_name TEXT,
  restaurant_address TEXT
)
LANGUAGE SQL
AS $$
  SELECT
    fi.food_id,
    fi.name,
    fi.description,
    fi.image_url,
    fi.price,
    -- Calculate distance using Haversine formula (returns distance in kilometers)
    ROUND(
      6371 * ACOS(
        COS(RADIANS(user_lat)) * COS(RADIANS(r.latitude)) * 
        COS(RADIANS(r.longitude) - RADIANS(user_lng)) + 
        SIN(RADIANS(user_lat)) * SIN(RADIANS(r.latitude))
      ),
      1
    ) AS distance_km,
    r.name AS restaurant_name,
    r.address AS restaurant_address
  FROM food_items fi
  INNER JOIN restaurants r ON fi.restaurant_id = r.restaurant_id
  WHERE fi.is_available = true
  ORDER BY distance_km ASC;
$$;

-- Note: This function assumes your 'restaurants' table has 'latitude' and 'longitude' columns.
-- If your column names are different, update them accordingly in the function above.
