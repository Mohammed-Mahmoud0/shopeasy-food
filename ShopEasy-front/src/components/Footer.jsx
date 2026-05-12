import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-title">{t('footer.aboutTitle')}</h3>
          <p className="muted">{t('footer.aboutCopy')}</p>
        </div>
        <div>
          <p className="eyebrow">{t('footer.explore')}</p>
          <ul className="footer-list">
            <li>
              <Link to="/">{t('footer.catalog')}</Link>
            </li>
            <li>
              <Link to="/cart">{t('nav.cart')}</Link>
            </li>
            <li>
              <Link to="/orders">{t('nav.orders')}</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">{t('footer.support')}</p>
          <ul className="footer-list">
            <li>
              <a href={`mailto:${t('footer.supportEmail')}`}>
                {t('footer.supportEmail')}
              </a>
            </li>
            <li>{t('footer.supportHours')}</li>
            <li>{t('footer.returns')}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t('footer.bottomLeft')}</span>
        <span>{t('footer.bottomRight')}</span>
      </div>
    </footer>
  )
}

export default Footer
