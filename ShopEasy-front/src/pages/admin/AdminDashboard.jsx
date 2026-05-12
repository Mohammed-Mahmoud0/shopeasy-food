import { useState } from 'react'
import EmptyState from '../../components/EmptyState'
import LoadingState from '../../components/LoadingState'
import { useAdminDashboard } from './useAdminDashboard'
import ProductManager from './ProductManager'
import CollectionManager from './CollectionManager'
import OrderMonitor from './OrderMonitor'

const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'collections', label: 'Categories' },
  { id: 'orders', label: 'Orders' },
]

const AdminDashboard = () => {
  const admin = useAdminDashboard()
  const [activeTab, setActiveTab] = useState('products')

  if (!admin.accessToken) {
    return (
      <EmptyState
        title={admin.t('admin.requireLogin')}
        message={admin.t('auth.signInCopy')}
        action={{ label: admin.t('auth.signIn'), to: '/auth' }}
      />
    )
  }

  if (!admin.isStaff) {
    return (
      <EmptyState
        title={admin.t('admin.requireStaff')}
        message={admin.t('admin.requireLogin')}
        action={{ label: admin.t('auth.signIn'), to: '/auth' }}
      />
    )
  }

  if (admin.status === 'loading') {
    return <LoadingState label={admin.t('common.loading')} />
  }

  return (
    <section className="section admin-page">
      <div className="section-heading admin-heading">
        <div>
          <p className="eyebrow">{admin.t('admin.eyebrow')}</p>
          <h2 className="section-title">{admin.t('admin.pageTitle')}</h2>
        </div>
        <div className="section-meta">{admin.t('admin.subtitle')}</div>
      </div>

      {admin.notice ? <div className="alert success">{admin.notice}</div> : null}
      {admin.error ? <div className="alert">{admin.error}</div> : null}

      <div className="admin-tabs" role="tablist" aria-label="Admin dashboard sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`admin-tab${activeTab === tab.id ? ' admin-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'products' ? <ProductManager admin={admin} /> : null}
      {activeTab === 'collections' ? <CollectionManager admin={admin} /> : null}
      {activeTab === 'orders' ? <OrderMonitor admin={admin} /> : null}
    </section>
  )
}

export default AdminDashboard
