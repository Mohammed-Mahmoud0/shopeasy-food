import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

const navLinkClass = ({ isActive }) =>
  `nav-link${isActive ? ' nav-link-active' : ''}`

const Navbar = () => {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const nextLanguage = language === 'en' ? 'ar' : 'en'
  const switchLabel =
    language === 'en' ? t('nav.switchToArabic') : t('nav.switchToEnglish')
  const greetingName = user?.first_name || user?.username || ''

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/">
          <span className="brand-mark">SE</span>
          <span className="brand-text">{t('nav.brand')}</span>
        </Link>
        <nav className="nav-links">
          <NavLink className={navLinkClass} to="/">
            {t('nav.shop')}
          </NavLink>
          <NavLink className={navLinkClass} to="/cart">
            {t('nav.cart')} <span className="nav-pill">{itemCount}</span>
          </NavLink>
          <NavLink className={navLinkClass} to="/orders">
            {t('nav.orders')}
          </NavLink>
          {user?.is_staff ? (
            <NavLink className={navLinkClass} to="/admin">
              {t('nav.admin')}
            </NavLink>
          ) : null}
        </nav>
        <div className="nav-actions">
          <button
            className="button button-ghost lang-toggle"
            type="button"
            onClick={() => setLanguage(nextLanguage)}
          >
            {switchLabel}
          </button>
          {user ? (
            <>
              <NavLink className="button button-ghost" to="/profile">
                {t('nav.greeting', { name: greetingName })}
              </NavLink>
              <button className="button button-outline" type="button" onClick={logout}>
                {t('nav.signOut')}
              </button>
            </>
          ) : (
            <NavLink className="button button-primary" to="/auth">
              {t('nav.signIn')}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
