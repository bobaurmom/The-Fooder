// import { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '../lib/supabaseClient'
// import api from '../lib/api';
// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(null)
//   const [loading, setLoading] = useState(true) // true while we check for an existing session

//   useEffect(() => {
//     // On first load: is there already a logged-in session (e.g. from a previous visit)?
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session)
//       setLoading(false)
//     })

//     // Keep session in sync on login / logout / token refresh, from any tab.
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
//       setSession(newSession)
//     })

//     return () => listener.subscription.unsubscribe()
//   }, [])

//   // const signUp = async ({ name, email, password }) => {
//   //   const { data, error } = await supabase.auth.signUp({
//   //     email,
//   //     password,
//   //     options: { data: { full_name: name } }, // stored in user_metadata
//   //   })
//   //   if (error) throw error
//   //   // If your Supabase project has "Confirm email" turned on, data.session
//   //   // will be null here even though the account was created — the caller
//   //   // should tell the user to check their inbox rather than assuming login.
//   //   return { emailConfirmationRequired: !data.session }
//   // }

//   const signUp = async (email, password, username) => {
//   const response = await api.post('/auth/register', {
//     email,
//     password,
//     username
//   });
//   return response.data;
// };

//   const signIn = async ({ email, password }) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password })
//     if (error) throw error
//   }

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   }

//   const value = {
//     session,
//     user: session?.user ?? null,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//     updateProfile, 
// }
  

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
//   return ctx
// }

// const updateProfile = async ({ name, address }) => {
//   const { error } = await supabase.auth.updateUser({
//     data: { full_name: name, address },
//   })
//   if (error) throw error
//   // onAuthStateChange fires a USER_UPDATED event automatically,
//   // so `user` in context refreshes itself — no manual setSession needed.
// }

// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // ✅ Use Supabase directly
  const signUp = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name } // stored in user_metadata
      }
    })

    if (error) throw error
    return { emailConfirmationRequired: !data.session }
  }

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async ({ name, address }) => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, address },
    })
    if (error) throw error
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
