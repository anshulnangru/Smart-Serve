import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, updateProfile as apiUpdateProfile } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('smartserve_user')
    const savedToken = localStorage.getItem('smartserve_token')
    if (savedUser && savedToken) {
      try { setUser(JSON.parse(savedUser)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await loginUser({ email, password })
    const { user, token } = res.data
    setUser(user)
    localStorage.setItem('smartserve_user', JSON.stringify(user))
    localStorage.setItem('smartserve_token', token)
    return user
  }

  const register = async (name, email, password, phone) => {
    const res = await registerUser({ name, email, password, phone })
    const { user, token } = res.data
    setUser(user)
    localStorage.setItem('smartserve_user', JSON.stringify(user))
    localStorage.setItem('smartserve_token', token)
    return user
  }

  const updateUser = async (name, phone) => {
    const res = await apiUpdateProfile({ name, phone })
    const updatedUser = res.data.user
    setUser(updatedUser)
    localStorage.setItem('smartserve_user', JSON.stringify(updatedUser))
    return updatedUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartserve_user')
    localStorage.removeItem('smartserve_token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
