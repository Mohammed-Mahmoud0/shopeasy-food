import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'

const Auth = () => {
  const navigate = useNavigate()
  const { user, login, register } = useAuth()
  const { t } = useLanguage()
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
  })
  const [loginStatus, setLoginStatus] = useState('idle')
  const [registerStatus, setRegisterStatus] = useState('idle')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [notice, setNotice] = useState('')

  if (user) {
    return (
      <EmptyState
        title={t('auth.alreadyTitle')}
        message={t('auth.alreadyMessage')}
        action={{ label: t('auth.goToProfile'), to: '/profile' }}
      />
    )
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginStatus('loading')
    setLoginError('')

    try {
      await login(loginForm)
      setLoginStatus('ready')
      navigate('/')
    } catch (err) {
      setLoginStatus('error')
      setLoginError(getErrorMessage(err))
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setRegisterStatus('loading')
    setRegisterError('')
    setNotice('')

    if (registerForm.password !== registerForm.re_password) {
      setRegisterStatus('error')
      setRegisterError(t('auth.passwordMismatch'))
      return
    }

    try {
      await register(registerForm)
      setRegisterStatus('ready')
      setNotice(t('auth.accountCreated'))
      setRegisterForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        re_password: '',
      })
    } catch (err) {
      setRegisterStatus('error')
      setRegisterError(getErrorMessage(err))
    }
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('auth.eyebrow')}</p>
          <h2 className="section-title">{t('auth.title')}</h2>
        </div>
        <div className="section-meta">{t('auth.subtitle')}</div>
      </div>

      <div className="auth-grid">
        <div className="auth-card">
          <h3 className="section-title">{t('auth.signIn')}</h3>
          <p className="muted">{t('auth.signInCopy')}</p>
          <form className="form-grid" onSubmit={handleLogin}>
            <label className="field">
              <span>{t('auth.username')}</span>
              <input
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
              />
            </label>
            <label className="field">
              <span>{t('auth.password')}</span>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </label>
            {loginError ? <div className="alert">{loginError}</div> : null}
            <button
              className="button button-primary"
              type="submit"
              disabled={loginStatus === 'loading'}
            >
              {loginStatus === 'loading'
                ? t('auth.signingIn')
                : t('auth.signIn')}
            </button>
          </form>
        </div>

        <div className="auth-card">
          <h3 className="section-title">{t('auth.createAccount')}</h3>
          <p className="muted">{t('auth.createCopy')}</p>
          <form className="form-grid" onSubmit={handleRegister}>
            <div className="form-row">
              <label className="field">
                <span>{t('auth.firstName')}</span>
                <input
                  name="first_name"
                  value={registerForm.first_name}
                  onChange={handleRegisterChange}
                />
              </label>
              <label className="field">
                <span>{t('auth.lastName')}</span>
                <input
                  name="last_name"
                  value={registerForm.last_name}
                  onChange={handleRegisterChange}
                />
              </label>
            </div>
            <label className="field">
              <span>{t('auth.username')}</span>
              <input
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                required
              />
            </label>
            <label className="field">
              <span>{t('auth.email')}</span>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
              />
            </label>
            <div className="form-row">
              <label className="field">
                <span>{t('auth.password')}</span>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label className="field">
                <span>{t('auth.confirmPassword')}</span>
                <input
                  type="password"
                  name="re_password"
                  value={registerForm.re_password}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
            </div>
            {registerError ? <div className="alert">{registerError}</div> : null}
            {notice ? <div className="alert success">{notice}</div> : null}
            <button
              className="button button-outline"
              type="submit"
              disabled={registerStatus === 'loading'}
            >
              {registerStatus === 'loading'
                ? t('auth.creating')
                : t('auth.createAccount')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Auth
