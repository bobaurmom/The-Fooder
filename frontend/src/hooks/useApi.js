import { useState, useCallback } from 'react'
import api from '../services/api'

export const useApi = (url, method = 'GET') => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(
    async (config = {}) => {
      setLoading(true)
      setError(null)
      try {
        const response = await api({
          url,
          method,
          ...config,
        })
        setData(response.data)
        return response.data
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url, method]
  )

  return { data, loading, error, request }
}

export default useApi
