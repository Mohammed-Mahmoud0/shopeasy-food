import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { authApi } from '../api/auth'
import { apiRequest } from '../api/client'

const AuthContext = createContext(null)
const TOKEN_KEY = 'shopeasy_tokens'

const loadTokens = () => {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}')
  } catch {
    return {}
  }
}

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(loadTokens)
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [status, setStatus] = useState('idle')

  const accessToken = tokens?.access || ''
  const refreshToken = tokens?.refresh || ''

  const saveTokens = useCallback((next) => {
    setTokens(next)
    localStorage.setItem(TOKEN_KEY, JSON.stringify(next))
  }, [])

  const clearTokens = useCallback(() => {
    setTokens({})
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  const refreshAccess = useCallback(async () => {
    if (!refreshToken) return null
    const data = await authApi.refresh({ refresh: refreshToken })
    const next = { access: data.access, refresh: refreshToken }
    saveTokens(next)
    return data.access
  }, [refreshToken, saveTokens])

  const authFetch = useCallback(
    async (path, options = {}) => {
      try {
        return await apiRequest(path, { ...options, token: accessToken })
      } catch (error) {
        if (error.status === 401 && refreshToken) {
          const nextAccess = await refreshAccess()
          if (nextAccess) {
            return apiRequest(path, { ...options, token: nextAccess })
          }
        }
        throw error
      }
    },
    [accessToken, refreshToken, refreshAccess],
  )

  const loadProfile = useCallback(async () => {
    if (!accessToken) return
    setStatus('loading')
    try {
      const userData = await authFetch('/auth/users/me/')
      let customerData = null
      try {
        customerData = await authFetch('/store/customers/me/')
      } catch {
        customerData = null
      }
      setUser(userData)
      setCustomer(customerData)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [accessToken, authFetch])

  useEffect(() => {
    if (accessToken) {
      loadProfile()
    } else {
      setUser(null)
      setCustomer(null)
    }
  }, [accessToken, loadProfile])

  const login = useCallback(
    async (payload) => {
      const data = await authApi.login(payload)
      saveTokens({ access: data.access, refresh: data.refresh })
      await loadProfile()
      return data
    },
    [saveTokens, loadProfile],
  )

  const register = useCallback((payload) => authApi.register(payload), [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    setCustomer(null)
  }, [clearTokens])

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      customer,
      status,
      login,
      register,
      logout,
      refreshAccess,
      authFetch,
      setCustomer,
    }),
    [
      accessToken,
      refreshToken,
      user,
      customer,
      status,
      login,
      register,
      logout,
      refreshAccess,
      authFetch,
      setCustomer,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
