import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { storeApi } from '../api/store'
import { useAuth } from '../context/AuthContext'
import { formatDate, getErrorMessage, membershipLabel } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'

const Profile = () => {
  const { user, customer, accessToken, setCustomer } = useAuth()
  const { t, language, locale } = useLanguage()
  const [form, setForm] = useState({ phone: '', birth_date: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (customer) {
      setForm({
        phone: customer.phone || '',
        birth_date: customer.birth_date || '',
      })
    }
  }, [customer])

  if (!user) {
    return (
      <EmptyState
        title={t('profile.signInTitle')}
        message={t('profile.signInMessage')}
        action={{ label: t('profile.signIn'), to: '/auth' }}
      />
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setNotice('')

    try {
      const payload = {
        phone: form.phone || null,
        birth_date: form.birth_date || null,
      }
      if (customer?.membership) {
        payload.membership = customer.membership
      }
      const updated = await storeApi.updateCustomerProfile(payload, accessToken)
      setCustomer(updated)
      setStatus('ready')
      setNotice(t('profile.updated'))
    } catch (err) {
      setStatus('error')
      setError(getErrorMessage(err))
    }
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('profile.eyebrow')}</p>
          <h2 className="section-title">{t('profile.title')}</h2>
        </div>
        <div className="section-meta">{t('profile.subtitle')}</div>
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <h3 className="section-title">{t('profile.userCard')}</h3>
          <div className="info-row">
            <span>{t('auth.username')}</span>
            <span>{user.username}</span>
          </div>
          <div className="info-row">
            <span>{t('auth.email')}</span>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <span>{t('auth.firstName')}</span>
            <span>
              {user.first_name || user.last_name
                ? `${user.first_name} ${user.last_name}`.trim()
                : t('profile.notSet')}
            </span>
          </div>
        </div>

        <div className="info-card">
          <h3 className="section-title">{t('profile.customerCard')}</h3>
          <div className="info-row">
            <span>{t('profile.membership')}</span>
            <span className="chip">
              {membershipLabel(customer?.membership, language)}
            </span>
          </div>
          <div className="info-row">
            <span>{t('profile.birthDate')}</span>
            <span>{formatDate(customer?.birth_date, locale) || t('profile.notSet')}</span>
          </div>
          <div className="info-row">
            <span>{t('profile.phone')}</span>
            <span>{customer?.phone || t('profile.notSet')}</span>
          </div>
        </div>
      </div>

      <form className="info-card" onSubmit={handleSubmit}>
        <h3 className="section-title">{t('profile.updateTitle')}</h3>
        <label className="field">
          <span>{t('profile.phone')}</span>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label className="field">
          <span>{t('profile.birthDate')}</span>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date || ''}
            onChange={handleChange}
          />
        </label>
        {error ? <div className="alert">{error}</div> : null}
        {notice ? <div className="alert success">{notice}</div> : null}
        <button
          className="button button-primary"
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? t('profile.saving') : t('profile.save')}
        </button>
      </form>
    </section>
  )
}

export default Profile
