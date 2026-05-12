import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import OrderStatusTracker from '../components/OrderStatusTracker'
import { storeApi } from '../api/store'
import { useAuth } from '../context/AuthContext'
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from '../utils/format'
import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const Orders = () => {
  const { accessToken } = useAuth()
  const { t, language, locale } = useLanguage()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return
    let ignore = false
    setStatus('loading')
    setError('')

    storeApi
      .listOrders(accessToken)
      .then((data) => {
        if (ignore) return
        const list = Array.isArray(data) ? data : data.results || []
        setOrders(list)
        setStatus('ready')
      })
      .catch((err) => {
        if (ignore) return
        setStatus('error')
        setError(getErrorMessage(err))
      })

    return () => {
      ignore = true
    }
  }, [accessToken])

  if (!accessToken) {
    return (
      <EmptyState
        title={t('orders.signInTitle')}
        message={t('orders.signInMessage')}
        action={{ label: t('auth.signIn'), to: '/auth' }}
      />
    )
  }

  if (status === 'loading') {
    return <LoadingState label={t('orders.loading')} />
  }

  if (status === 'error') {
    return <EmptyState title={t('orders.loadErrorTitle')} message={error} />
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title={t('orders.emptyTitle')}
        message={t('orders.emptyMessage')}
        action={{ label: t('orders.goToCart'), to: '/cart' }}
      />
    )
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('orders.eyebrow')}</p>
          <h2 className="section-title">{t('orders.title')}</h2>
        </div>
        <div className="section-meta">
          {t('orders.countLabel', { count: orders.length })}
        </div>
      </div>

      <div className="orders-grid">
        {orders.map((order) => {
          const statusClass =
            order.payment_status === 'C'
              ? 'status-complete'
              : order.payment_status === 'F'
                ? 'status-failed'
                : 'status-pending'
          const items = order.items || []
          const total = items.reduce(
            (sum, item) => sum + Number(item.unit_price) * item.quantity,
            0,
          )

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <strong>{t('orders.orderNumber', { id: order.id })}</strong>
                  <div className="muted">{formatDate(order.placed_at, locale)}</div>
                </div>
                <span className={`status-pill ${statusClass}`}>
                  {paymentStatusLabel(order.payment_status, language)}
                </span>
              </div>
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>
                      {getLocalizedField(
                        item.product?.title,
                        item.product?.title_ar,
                        language,
                      ) || 'Product'}
                    </span>
                    <span>
                      {item.quantity} x {formatCurrency(item.unit_price, locale)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-meta">
                <div>
                  <span className="muted">{t('orders.paymentMethod')}</span>
                  <strong>
                    {paymentMethodLabel(order.payment_method, language)}
                  </strong>
                </div>
                <div>
                  <span className="muted">{t('orders.orderStatus')}</span>
                  <strong>{orderStatusLabel(order.status, language)}</strong>
                </div>
              </div>
              <div className="order-tracker">
                <span className="muted">{t('orders.tracking')}</span>
                <OrderStatusTracker status={order.status} language={language} />
              </div>
              <div className="summary-row">
                <span>{t('orders.total')}</span>
                <span>{formatCurrency(total, locale)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Orders
