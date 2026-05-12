import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const NotFound = () => {
  const { t } = useLanguage()

  return (
    <section className="section">
      <div className="empty-state">
        <h3>{t('notFound.title')}</h3>
        <p className="muted">{t('notFound.message')}</p>
        <Link className="button button-primary" to="/">
          {t('notFound.action')}
        </Link>
      </div>
    </section>
  )
}

export default NotFound
