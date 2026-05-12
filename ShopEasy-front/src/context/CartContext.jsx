import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { storeApi } from '../api/store'
import { getErrorMessage } from '../utils/format'

const CartContext = createContext(null)
const CART_KEY = 'shopeasy_cart_id'

const readCartId = () => {
  try {
    return localStorage.getItem(CART_KEY) || ''
  } catch {
    return ''
  }
}

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(readCartId)
  const [cart, setCart] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const persistCartId = useCallback((id) => {
    setCartId(id)
    if (id) {
      localStorage.setItem(CART_KEY, id)
    } else {
      localStorage.removeItem(CART_KEY)
    }
  }, [])

  const createCart = useCallback(async () => {
    const data = await storeApi.createCart()
    persistCartId(data.id)
    setCart(data)
    return data.id
  }, [persistCartId])

  const loadCart = useCallback(
    async (id) => {
      if (!id) return
      setStatus('loading')
      setError('')
      try {
        const data = await storeApi.getCart(id)
        setCart(data)
        setStatus('ready')
      } catch (err) {
        if (err.status === 404) {
          await createCart()
          setStatus('ready')
          return
        }
        setStatus('error')
        setError(getErrorMessage(err))
      }
    },
    [createCart],
  )

  useEffect(() => {
    if (cartId) {
      loadCart(cartId)
    } else {
      createCart().catch(() => {})
    }
  }, [cartId, loadCart, createCart])

  const refreshCart = useCallback(
    async (id = cartId) => {
      if (!id) return null
      const data = await storeApi.getCart(id)
      setCart(data)
      return data
    },
    [cartId],
  )

  const ensureCartId = useCallback(async () => {
    if (cartId) return cartId
    const id = await createCart()
    return id
  }, [cartId, createCart])

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const id = await ensureCartId()
      setStatus('loading')
      setError('')
      try {
        await storeApi.addCartItem(id, { product_id: productId, quantity })
        await refreshCart(id)
        setStatus('ready')
      } catch (err) {
        setStatus('error')
        setError(getErrorMessage(err))
        throw err
      }
    },
    [ensureCartId, refreshCart],
  )

  const updateItem = useCallback(
    async (itemId, quantity) => {
      if (!cartId) return
      setStatus('loading')
      setError('')
      try {
        await storeApi.updateCartItem(cartId, itemId, { quantity })
        await refreshCart(cartId)
        setStatus('ready')
      } catch (err) {
        setStatus('error')
        setError(getErrorMessage(err))
        throw err
      }
    },
    [cartId, refreshCart],
  )

  const removeItem = useCallback(
    async (itemId) => {
      if (!cartId) return
      setStatus('loading')
      setError('')
      try {
        await storeApi.deleteCartItem(cartId, itemId)
        await refreshCart(cartId)
        setStatus('ready')
      } catch (err) {
        setStatus('error')
        setError(getErrorMessage(err))
        throw err
      }
    },
    [cartId, refreshCart],
  )

  const resetCart = useCallback(async () => {
    try {
      if (cartId) {
        await storeApi.deleteCart(cartId)
      }
    } catch {
      // ignore
    }
    const id = await createCart()
    await refreshCart(id)
  }, [cartId, createCart, refreshCart])

  const itemCount = useMemo(() => {
    const items = cart?.items || []
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const value = useMemo(
    () => ({
      cartId,
      cart,
      status,
      error,
      itemCount,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
      resetCart,
    }),
    [
      cartId,
      cart,
      status,
      error,
      itemCount,
      addItem,
      updateItem,
      removeItem,
      refreshCart,
      resetCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
