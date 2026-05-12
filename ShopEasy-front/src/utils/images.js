import { API_BASE_URL } from '../api/client'

export const resolveImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const trimmed = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${trimmed}`
}

export const getProductImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return ''
  const image = images[0]
  if (typeof image === 'string') return resolveImageUrl(image)
  return resolveImageUrl(image.image || image.url || '')
}
