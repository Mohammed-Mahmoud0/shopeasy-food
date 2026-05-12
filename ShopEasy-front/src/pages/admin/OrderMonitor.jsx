import EmptyState from '../../components/EmptyState'
import OrderStatusTracker from '../../components/OrderStatusTracker'
import Pagination from '../../components/Pagination'
import { getLocalizedField } from '../../context/LanguageContext'
import {
  formatCurrency,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from '../../utils/format'

const OrderMonitor = ({ admin }) => {
  const {
    t,
    language,
    locale,
    filteredOrders,
    paginatedOrders,
    orderSearch,
    setOrderSearch,
    orderPage,
    setOrderPage,
    orderTotalPages,
    statusChanges,
    STATUS_OPTIONS,
    handleStatusChange,
  } = admin

  return (
    <div className="admin-stack">
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">{t('orders.tracking')}</p>
            <h3 className="section-title">{t('admin.ordersTitle')}</h3>
          </div>
          <input className="admin-search" value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder={t('admin.searchOrdersPlaceholder')} />
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState title={t('admin.noOrders')} />
        ) : (
          <>
            <div className="admin-list order-admin-list">
              {paginatedOrders.map((order) => {
                const items = order.items || []
                const isBusy = statusChanges.includes(order.id)
                const total = items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0)

                return (
                  <div key={order.id} className="order-card order-card-admin">
                    <div className="order-header">
                      <div>
                        <strong>{t('orders.orderNumber', { id: order.id })}</strong>
                        <div className="muted">
                          {paymentStatusLabel(order.payment_status, language)} · {paymentMethodLabel(order.payment_method, language)}
                        </div>
                      </div>
                      <span className="status-pill status-complete">{orderStatusLabel(order.status, language)}</span>
                    </div>

                    <OrderStatusTracker status={order.status} language={language} />

                    <div className="status-stepper">
                      {STATUS_OPTIONS.map((code) => (
                        <button
                          key={code}
                          type="button"
                          className={`status-step-button${code === order.status ? ' status-step-button-active' : ''}`}
                          onClick={() => handleStatusChange(order, code)}
                          disabled={isBusy || code === order.status}
                        >
                          {orderStatusLabel(code, language)}
                        </button>
                      ))}
                    </div>

                    <div className="order-items order-items-admin">
                      {items.map((item) => (
                        <div key={item.id} className="order-item">
                          <span>{getLocalizedField(item.product?.title, item.product?.title_ar, language) || 'Product'}</span>
                          <span>{item.quantity} x {formatCurrency(item.unit_price, locale)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-row">
                      <span>{t('orders.total')}</span>
                      <span>{formatCurrency(total, locale)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Pagination page={orderPage} totalPages={orderTotalPages} onPageChange={setOrderPage} />
          </>
        )}
      </section>
    </div>
  )
}

export default OrderMonitor
