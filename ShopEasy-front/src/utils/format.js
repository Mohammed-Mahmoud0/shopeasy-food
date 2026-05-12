export const formatCurrency = (value, locale = 'en-US') => {
  const number = Number(value)
  if (Number.isNaN(number)) {
    return '$0.00'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(number)
}

export const formatDate = (value, locale = 'en-US') => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

const labelMaps = {
  membership: {
    en: { B: 'Bronze', S: 'Silver', G: 'Gold' },
    ar: { B: 'برونزي', S: 'فضي', G: 'ذهبي' },
  },
  paymentStatus: {
    en: { P: 'Pending', C: 'Complete', F: 'Failed' },
    ar: { P: 'قيد الانتظار', C: 'مكتمل', F: 'فشل' },
  },
  paymentMethod: {
    en: { C: 'Cash on delivery', O: 'Online payment' },
    ar: { C: 'كاش عند الاستلام', O: 'دفع اونلاين' },
  },
  orderStatus: {
    en: {
      P: 'Placed',
      R: 'Preparing',
      O: 'Out for delivery',
      D: 'Delivered',
      X: 'Cancelled',
    },
    ar: {
      P: 'تم الاستلام',
      R: 'قيد التحضير',
      O: 'في الطريق',
      D: 'تم التسليم',
      X: 'ملغي',
    },
  },
}

const resolveLabel = (group, code, language = 'en', fallback = 'Unknown') => {
  const map = labelMaps[group] || {}
  return map[language]?.[code] || map.en?.[code] || fallback
}

export const membershipLabel = (code, language = 'en') =>
  resolveLabel('membership', code, language, 'Member')

export const paymentStatusLabel = (code, language = 'en') =>
  resolveLabel('paymentStatus', code, language, 'Unknown')

export const paymentMethodLabel = (code, language = 'en') =>
  resolveLabel('paymentMethod', code, language, 'Unknown')

export const orderStatusLabel = (code, language = 'en') =>
  resolveLabel('orderStatus', code, language, 'Unknown')

export const getErrorMessage = (error) => {
  if (!error) return 'Something went wrong.'
  if (typeof error === 'string') return error
  const data = error.data
  if (!data) return 'Something went wrong.'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (typeof data === 'object') {
    const messages = Object.values(data).flat().filter(Boolean)
    if (messages.length) return messages.join(' ')
  }
  return 'Something went wrong.'
}
