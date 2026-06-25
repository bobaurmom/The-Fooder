import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    setError(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const signIn = async (email, password) => {
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      setError(err.message)
    }
  }

  return { user, loading, error, signUp, signIn, signOut }
}

// import { useEffect, useState } from 'react';
// import { getCurrentUser } from '../services/authService';

// const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const data = await getCurrentUser();
//         setUser(data);
//       } catch (error) {
//         console.error('Failed to get current user:', error);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { user, setUser, loading, logout };
// };

// export default useAuth;