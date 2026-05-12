import { apiRequest } from './client'

export const storeApi = {
  listProducts: (params) => apiRequest('/store/products/', { params }),
  getProduct: (id) => apiRequest(`/store/products/${id}/`),
  createProduct: (payload, token) =>
    apiRequest('/store/products/', {
      method: 'POST',
      body: payload,
      token,
    }),
  updateProduct: (productId, payload, token) =>
    apiRequest(`/store/products/${productId}/`, {
      method: 'PATCH',
      body: payload,
      token,
    }),
  deleteProduct: (productId, token) =>
    apiRequest(`/store/products/${productId}/`, {
      method: 'DELETE',
      token,
    }),
  listCollections: () => apiRequest('/store/collections/'),
  createCollection: (payload, token) =>
    apiRequest('/store/collections/', {
      method: 'POST',
      body: payload,
      token,
    }),
  updateCollection: (collectionId, payload, token) =>
    apiRequest(`/store/collections/${collectionId}/`, {
      method: 'PATCH',
      body: payload,
      token,
    }),
  deleteCollection: (collectionId, token) =>
    apiRequest(`/store/collections/${collectionId}/`, {
      method: 'DELETE',
      token,
    }),
  listProductImages: (productId) =>
    apiRequest(`/store/products/${productId}/images/`),
  createProductImage: (productId, body, token) =>
    apiRequest(`/store/products/${productId}/images/`, {
      method: 'POST',
      body,
      token,
    }),
  updateProductImage: (productId, imageId, body, token) =>
    apiRequest(`/store/products/${productId}/images/${imageId}/`, {
      method: 'PATCH',
      body,
      token,
    }),
  deleteProductImage: (productId, imageId, token) =>
    apiRequest(`/store/products/${productId}/images/${imageId}/`, {
      method: 'DELETE',
      token,
    }),
  listReviews: (productId) =>
    apiRequest(`/store/products/${productId}/reviews/`),
  createReview: (productId, payload) =>
    apiRequest(`/store/products/${productId}/reviews/`, {
      method: 'POST',
      body: payload,
    }),
  createCart: () => apiRequest('/store/carts/', { method: 'POST', body: {} }),
  getCart: (cartId) => apiRequest(`/store/carts/${cartId}/`),
  deleteCart: (cartId) =>
    apiRequest(`/store/carts/${cartId}/`, { method: 'DELETE' }),
  listCartItems: (cartId) => apiRequest(`/store/carts/${cartId}/items/`),
  addCartItem: (cartId, payload) =>
    apiRequest(`/store/carts/${cartId}/items/`, {
      method: 'POST',
      body: payload,
    }),
  updateCartItem: (cartId, itemId, payload) =>
    apiRequest(`/store/carts/${cartId}/items/${itemId}/`, {
      method: 'PATCH',
      body: payload,
    }),
  deleteCartItem: (cartId, itemId) =>
    apiRequest(`/store/carts/${cartId}/items/${itemId}/`, {
      method: 'DELETE',
    }),
  listOrders: (token) => apiRequest('/store/orders/', { token }),
  updateOrder: (orderId, payload, token) =>
    apiRequest(`/store/orders/${orderId}/`, {
      method: 'PATCH',
      body: payload,
      token,
    }),
  createOrder: (payload, token) =>
    apiRequest('/store/orders/', { method: 'POST', body: payload, token }),
  getCustomerProfile: (token) => apiRequest('/store/customers/me/', { token }),
  updateCustomerProfile: (payload, token) =>
    apiRequest('/store/customers/me/', {
      method: 'PUT',
      body: payload,
      token,
    }),
}
