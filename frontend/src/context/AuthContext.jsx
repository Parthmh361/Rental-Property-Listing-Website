import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
  }, [token])

  // Attach token to axios
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return () => api.interceptors.request.eject(interceptor)
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser({ _id: data._id, name: data.name, email: data.email })
    setToken(data.token)
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    setUser({ _id: data._id, name: data.name, email: data.email })
    setToken(data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
