import { Navigate } from 'react-router-dom'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const AdminRoute = ({ children }) => {
  const { user, status } = useAuth()
  const { t } = useLanguage()

  if (status === 'loading') {
    return <LoadingState label={t('common.loading')} />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (!user?.is_staff) {
    return (
      <EmptyState
        title={t('admin.requireStaff')}
        message={t('admin.requireLogin')}
        action={{ label: t('auth.signIn'), to: '/auth' }}
      />
    )
  }

  return children
}

export default AdminRoute