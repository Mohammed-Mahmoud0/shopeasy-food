import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { storeApi } from '../api/store'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import QuantityInput from '../components/QuantityInput'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatCurrency, getErrorMessage } from '../utils/format'
import { getProductImage } from '../utils/images'
import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const Cart = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { cart, status, error, updateItem, removeItem, resetCart } = useCart()
  const { t, language, locale } = useLanguage()
  const [checkoutStatus, setCheckoutStatus] = useState('idle')
  const [checkoutError, setCheckoutError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('C')

  const items = cart?.items || []
  const totalPrice = cart?.total_price || 0

  const handleCheckout = async () => {
    if (!accessToken) {
      navigate('/auth')
      return
    }
    if (!cart?.id) return

    setCheckoutStatus('loading')
    setCheckoutError('')

    try {
      await storeApi.createOrder(
        { cart_id: cart.id, payment_method: paymentMethod },
        accessToken,
      )
      await resetCart()
      setCheckoutStatus('ready')
      navigate('/orders')
    } catch (err) {
      setCheckoutStatus('error')
      setCheckoutError(getErrorMessage(err))
    }
  }

  if (status === 'loading' && !cart) {
    return <LoadingState label={t('cart.loading')} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('cart.emptyTitle')}
        message={t('cart.emptyMessage')}
        action={{ label: t('cart.startShopping'), to: '/' }}
      />
    )
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('cart.eyebrow')}</p>
          <h2 className="section-title">{t('cart.title')}</h2>
        </div>
        <div className="section-meta">
          {t('cart.itemsLabel', { count: items.length })}
        </div>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => {
            const image = getProductImage(item.product?.images)
            const title = getLocalizedField(
              item.product?.title,
              item.product?.title_ar,
              language,
            )
            return (
              <div key={item.id} className="cart-item">
                {image ? (
                  <img src={image} alt={title || 'Product'} />
                ) : (
                  <div className="image-placeholder">{t('product.noImage')}</div>
                )}
                <div className="cart-item-info">
                  <h3 className="cart-item-title">
                    {title || 'Product'}
                  </h3>
                  <span className="muted">
                    {formatCurrency(item.product?.unit_price, locale)} {t('cart.each')}
                  </span>
                  <span className="muted">
                    {t('cart.itemTotal')}:{' '}
                    {formatCurrency(item.total_price, locale)}
                  </span>
                </div>
                <div className="cart-item-actions">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(value) =>
                      updateItem(item.id, value).catch(() => {})
                    }
                  />
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => removeItem(item.id).catch(() => {})}
                    aria-label="Remove item"
                  >
                    x
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="cart-summary">
          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>{formatCurrency(totalPrice, locale)}</span>
          </div>
          <p className="muted">{t('cart.taxIncluded')}</p>

          <div className="summary-section">
            <div className="summary-label">{t('cart.paymentMethod')}</div>
            <p className="muted">{t('cart.paymentHint')}</p>
            <div className="payment-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="payment"
                  value="C"
                  checked={paymentMethod === 'C'}
                  onChange={() => setPaymentMethod('C')}
                />
                <span>{t('cart.paymentCod')}</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="payment"
                  value="O"
                  checked={paymentMethod === 'O'}
                  onChange={() => setPaymentMethod('O')}
                />
                <span>{t('cart.paymentOnline')}</span>
              </label>
            </div>
          </div>

          {checkoutError ? <div className="alert">{checkoutError}</div> : null}

          {accessToken ? (
            <button
              className="button button-primary"
              type="button"
              onClick={handleCheckout}
              disabled={checkoutStatus === 'loading'}
            >
              {checkoutStatus === 'loading'
                ? t('cart.placingOrder')
                : t('cart.placeOrder')}
            </button>
          ) : (
            <div>
              <p className="muted">{t('cart.signInPrompt')}</p>
              <Link className="button button-primary" to="/auth">
                {t('cart.signIn')}
              </Link>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default Cart
