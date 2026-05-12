export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const isEmptyValue = (value) =>
  value === undefined || value === null || value === ''

export const buildUrl = (path, params) => {
  const url = new URL(path, API_BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (isEmptyValue(value)) return
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    token,
    params,
    body,
    headers = {},
    signal,
  } = options

  const requestHeaders = { ...headers }
  const isFormData = body instanceof FormData

  if (token) {
    requestHeaders.Authorization = `JWT ${token}`
  }
  if (body && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error('API request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
