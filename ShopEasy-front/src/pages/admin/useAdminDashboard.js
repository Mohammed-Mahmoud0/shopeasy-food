import { useCallback, useEffect, useMemo, useState } from 'react'
import { storeApi } from '../../api/store'
import { useAuth } from '../../context/AuthContext'
import { getLocalizedField, useLanguage } from '../../context/LanguageContext'
import {
  COLLECTION_PAGE_SIZE,
  ORDER_PAGE_SIZE,
  PRODUCT_PAGE_SIZE,
  emptyCollectionForm,
  emptyProductForm,
  slugify,
  STATUS_OPTIONS,
  toFormData,
} from './adminUtils'
import {
  getErrorMessage,
  orderStatusLabel,
  paymentStatusLabel,
} from '../../utils/format'

export const useAdminDashboard = () => {
  const { user, accessToken } = useAuth()
  const { t, language, locale } = useLanguage()
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [collectionSearch, setCollectionSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [productPage, setProductPage] = useState(1)
  const [collectionPage, setCollectionPage] = useState(1)
  const [orderPage, setOrderPage] = useState(1)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [collectionForm, setCollectionForm] = useState(emptyCollectionForm)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingCollectionId, setEditingCollectionId] = useState(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [savingCollection, setSavingCollection] = useState(false)
  const [deletingIds, setDeletingIds] = useState([])
  const [statusChanges, setStatusChanges] = useState([])
  const [productImageFiles, setProductImageFiles] = useState({})

  const isStaff = Boolean(user?.is_staff)

  const loadData = useCallback(async () => {
    if (!accessToken || !isStaff) return
    setStatus('loading')
    setError('')
    setNotice('')
    try {
      const [productsData, collectionsData, ordersData] = await Promise.all([
        storeApi.listProducts({ page_size: 200 }),
        storeApi.listCollections(),
        storeApi.listOrders(accessToken),
      ])
      setProducts(Array.isArray(productsData) ? productsData : productsData.results || [])
      setCollections(Array.isArray(collectionsData) ? collectionsData : collectionsData.results || [])
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || [])
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(getErrorMessage(err))
    }
  }, [accessToken, isStaff])

  useEffect(() => {
    loadData()
  }, [loadData])

  const collectionById = useMemo(
    () => new Map(collections.map((collection) => [String(collection.id), collection])),
    [collections],
  )

  const productOptions = useMemo(
    () =>
      collections.map((collection) => ({
        id: collection.id,
        label: getLocalizedField(collection.title, collection.title_ar, language),
      })),
    [collections, language],
  )

  const findCollection = useCallback(
    (collectionId) => collectionById.get(String(collectionId)),
    [collectionById],
  )

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => {
      const title = getLocalizedField(product.title, product.title_ar, language)
      const description = getLocalizedField(product.description, product.description_ar, language)
      const collection = getLocalizedField(
        findCollection(product.collection)?.title,
        findCollection(product.collection)?.title_ar,
        language,
      )
      return [title, description, collection].some((value) => value?.toLowerCase().includes(term))
    })
  }, [products, productSearch, language, findCollection])

  const filteredCollections = useMemo(() => {
    const term = collectionSearch.trim().toLowerCase()
    if (!term) return collections
    return collections.filter((collection) => {
      const title = getLocalizedField(collection.title, collection.title_ar, language)
      return title.toLowerCase().includes(term)
    })
  }, [collections, collectionSearch, language])

  const filteredOrders = useMemo(() => {
    const term = orderSearch.trim().toLowerCase()
    if (!term) return orders
    return orders.filter((order) => {
      const id = String(order.id).toLowerCase()
      const statusLabel = orderStatusLabel(order.status, language).toLowerCase()
      const paymentLabel = paymentStatusLabel(order.payment_status, language).toLowerCase()
      return [id, statusLabel, paymentLabel].some((value) => value.includes(term))
    })
  }, [orders, orderSearch, language])

  const productTotalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCT_PAGE_SIZE))
  const collectionTotalPages = Math.max(1, Math.ceil(filteredCollections.length / COLLECTION_PAGE_SIZE))
  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE))

  const paginatedProducts = useMemo(
    () => filteredProducts.slice((productPage - 1) * PRODUCT_PAGE_SIZE, productPage * PRODUCT_PAGE_SIZE),
    [filteredProducts, productPage],
  )

  const paginatedCollections = useMemo(
    () => filteredCollections.slice((collectionPage - 1) * COLLECTION_PAGE_SIZE, collectionPage * COLLECTION_PAGE_SIZE),
    [filteredCollections, collectionPage],
  )

  const paginatedOrders = useMemo(
    () => filteredOrders.slice((orderPage - 1) * ORDER_PAGE_SIZE, orderPage * ORDER_PAGE_SIZE),
    [filteredOrders, orderPage],
  )

  useEffect(() => {
    setProductPage(1)
  }, [productSearch])

  useEffect(() => {
    setCollectionPage(1)
  }, [collectionSearch])

  useEffect(() => {
    setOrderPage(1)
  }, [orderSearch])

  useEffect(() => {
    if (productPage > productTotalPages) setProductPage(productTotalPages)
  }, [productPage, productTotalPages])

  useEffect(() => {
    if (collectionPage > collectionTotalPages) setCollectionPage(collectionTotalPages)
  }, [collectionPage, collectionTotalPages])

  useEffect(() => {
    if (orderPage > orderTotalPages) setOrderPage(orderTotalPages)
  }, [orderPage, orderTotalPages])

  const resetProductForm = useCallback(() => {
    setEditingProductId(null)
    setProductForm(emptyProductForm)
    setProductImageFiles({})
  }, [])

  const resetCollectionForm = useCallback(() => {
    setEditingCollectionId(null)
    setCollectionForm(emptyCollectionForm)
  }, [])

  const handleProductInput = useCallback((event) => {
    const { name, value } = event.target
    setProductForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCollectionInput = useCallback((event) => {
    const { name, value } = event.target
    setCollectionForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleProductImageSelect = useCallback((key, file) => {
    setProductImageFiles((prev) => ({ ...prev, [key]: file || null }))
  }, [])

  const uploadSelectedProductImage = useCallback(
    async (productId, key) => {
      const file = productImageFiles[key]
      if (!file || !accessToken) return
      await storeApi.createProductImage(productId, toFormData('image', file), accessToken)
    },
    [productImageFiles, accessToken],
  )

  const replaceProductImage = useCallback(
    async (productId, imageId, key) => {
      const file = productImageFiles[key]
      if (!file || !accessToken) return
      await storeApi.updateProductImage(productId, imageId, toFormData('image', file), accessToken)
      setProductImageFiles((prev) => ({ ...prev, [key]: null }))
    },
    [productImageFiles, accessToken],
  )

  const removeProductImage = useCallback(
    async (productId, imageId) => {
      if (!accessToken) return
      await storeApi.deleteProductImage(productId, imageId, accessToken)
    },
    [accessToken],
  )

  const handleSubmitCollection = useCallback(
    async (event) => {
      event.preventDefault()
      if (!accessToken) return
      setSavingCollection(true)
      setError('')
      setNotice('')
      const payload = {
        title: collectionForm.title.trim(),
        title_ar: collectionForm.title_ar.trim(),
      }

      try {
        if (editingCollectionId) {
          await storeApi.updateCollection(editingCollectionId, payload, accessToken)
        } else {
          await storeApi.createCollection(payload, accessToken)
        }
        setNotice(t('admin.categorySaved'))
        resetCollectionForm()
        await loadData()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSavingCollection(false)
      }
    },
    [accessToken, collectionForm, editingCollectionId, loadData, resetCollectionForm, t],
  )

  const handleEditCollection = useCallback((collection) => {
    setEditingCollectionId(collection.id)
    setCollectionForm({ title: collection.title || '', title_ar: collection.title_ar || '' })
  }, [])

  const handleDeleteCollection = useCallback(
    async (collection) => {
      if (!accessToken) return
      if (!window.confirm(`${t('admin.delete')} ${collection.title}?`)) return
      setDeletingIds((prev) => [...prev, `collection-${collection.id}`])
      setError('')
      setNotice('')
      try {
        await storeApi.deleteCollection(collection.id, accessToken)
        setNotice(t('admin.categoryDeleted'))
        await loadData()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setDeletingIds((prev) => prev.filter((id) => id !== `collection-${collection.id}`))
      }
    },
    [accessToken, loadData, t],
  )

  const handleEditProduct = useCallback((product) => {
    setEditingProductId(product.id)
    setProductForm({
      title: product.title || '',
      title_ar: product.title_ar || '',
      description: product.description || '',
      description_ar: product.description_ar || '',
      unit_price: product.unit_price ?? '',
      inventory: product.inventory ?? '',
      collection: product.collection ?? '',
      slug: product.slug || '',
    })
  }, [])

  const handleSubmitProduct = useCallback(
    async (event) => {
      event.preventDefault()
      if (!accessToken) return
      setSavingProduct(true)
      setError('')
      setNotice('')
      const payload = {
        title: productForm.title.trim(),
        title_ar: productForm.title_ar.trim(),
        description: productForm.description.trim(),
        description_ar: productForm.description_ar.trim(),
        unit_price: Number(productForm.unit_price),
        inventory: Number(productForm.inventory),
        collection: Number(productForm.collection),
        slug: productForm.slug.trim() || slugify(productForm.title),
      }

      try {
        if (editingProductId) {
          await storeApi.updateProduct(editingProductId, payload, accessToken)
          const file = productImageFiles[`form-${editingProductId}`]
          if (file) {
            await uploadSelectedProductImage(editingProductId, `form-${editingProductId}`)
          }
        } else {
          const created = await storeApi.createProduct(payload, accessToken)
          const file = productImageFiles.formNew
          if (file) {
            await uploadSelectedProductImage(created.id, 'formNew')
          }
        }
        setNotice(t('admin.productSaved'))
        resetProductForm()
        await loadData()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSavingProduct(false)
      }
    },
    [accessToken, editingProductId, loadData, productForm, productImageFiles, resetProductForm, t, uploadSelectedProductImage],
  )

  const handleDeleteProduct = useCallback(
    async (product) => {
      if (!accessToken) return
      if (!window.confirm(`${t('admin.delete')} ${product.title}?`)) return
      setDeletingIds((prev) => [...prev, `product-${product.id}`])
      setError('')
      setNotice('')
      try {
        await storeApi.deleteProduct(product.id, accessToken)
        setNotice(t('admin.productDeleted'))
        await loadData()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setDeletingIds((prev) => prev.filter((id) => id !== `product-${product.id}`))
      }
    },
    [accessToken, loadData, t],
  )

  const handleStatusChange = useCallback(
    async (order, nextStatus) => {
      if (!accessToken || nextStatus === order.status) return
      setStatusChanges((prev) => [...prev, order.id])
      setError('')
      setNotice('')
      try {
        const updated = await storeApi.updateOrder(order.id, { status: nextStatus }, accessToken)
        setOrders((prev) => prev.map((item) => (item.id === order.id ? updated : item)))
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setStatusChanges((prev) => prev.filter((id) => id !== order.id))
      }
    },
    [accessToken],
  )

  return {
    accessToken,
    isStaff,
    status,
    error,
    notice,
    t,
    language,
    locale,
    products,
    collections,
    orders,
    productOptions,
    filteredProducts,
    filteredCollections,
    filteredOrders,
    productSearch,
    collectionSearch,
    orderSearch,
    setProductSearch,
    setCollectionSearch,
    setOrderSearch,
    productPage,
    setProductPage,
    collectionPage,
    setCollectionPage,
    orderPage,
    setOrderPage,
    productTotalPages,
    collectionTotalPages,
    orderTotalPages,
    paginatedProducts,
    paginatedCollections,
    paginatedOrders,
    productForm,
    collectionForm,
    editingProductId,
    editingCollectionId,
    savingProduct,
    savingCollection,
    deletingIds,
    statusChanges,
    productImageFiles,
    resetProductForm,
    resetCollectionForm,
    handleProductInput,
    handleCollectionInput,
    handleProductImageSelect,
    handleSubmitProduct,
    handleSubmitCollection,
    handleEditProduct,
    handleEditCollection,
    handleDeleteProduct,
    handleDeleteCollection,
    replaceProductImage,
    removeProductImage,
    handleStatusChange,
    loadData,
    STATUS_OPTIONS,
    findCollection,
  }
}
