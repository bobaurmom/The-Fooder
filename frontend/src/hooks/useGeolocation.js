import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../utils/geolocation';
import api from '../services/api';

/**
 * Custom hook to fetch user location and make API calls with location parameters
 * @param {string} endpoint - The API endpoint to call (e.g., '/foods')
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useGeolocationApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to get user location...');
      // Try to get user location
      const location = await getCurrentLocation();
      console.log('Location obtained:', location);
      
      // If location is available, append lat/lng as query parameters
      const response = await api.get(endpoint, {
        params: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
      
      console.log('API response with location:', response.data);
      setData(response.data);
    } catch (locationError) {
      // If location permission is denied or unavailable, fall back to standard request
      console.warn('Location fetch failed, falling back to standard request:', locationError.message);
      
      try {
        const response = await api.get(endpoint);
        console.log('API response without location:', response.data);
        setData(response.data);
      } catch (apiError) {
        console.error('API error:', apiError);
        setError(apiError.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithLocation();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchWithLocation };
};

export default useGeolocationApi;
