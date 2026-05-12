import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { storeApi } from '../api/store'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import QuantityInput from '../components/QuantityInput'
import { useCart } from '../context/CartContext'
import { formatCurrency, formatDate, getErrorMessage } from '../utils/format'
import { resolveImageUrl } from '../utils/images'
import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const ProductDetail = () => {
  const { productId } = useParams()
  const { addItem } = useCart()
  const { t, language, locale } = useLanguage()
  const [product, setProduct] = useState(null)
  const [images, setImages] = useState([])
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [reviewForm, setReviewForm] = useState({ name: '', description: '' })
  const [reviewStatus, setReviewStatus] = useState('idle')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    let ignore = false

    const load = async () => {
      setStatus('loading')
      setError('')

      try {
        const productData = await storeApi.getProduct(productId)
        if (ignore) return
        setProduct(productData)
        setImages(Array.isArray(productData.images) ? productData.images : [])
        setStatus('ready')
      } catch (err) {
        if (!ignore) {
          setStatus('error')
          setError(getErrorMessage(err))
        }
        return
      }

      try {
        const imagesData = await storeApi.listProductImages(productId)
        if (!ignore && Array.isArray(imagesData)) {
          setImages(imagesData)
        }
      } catch {
        // ignore
      }

      try {
        const reviewsData = await storeApi.listReviews(productId)
        if (!ignore) {
          const list = Array.isArray(reviewsData)
            ? reviewsData
            : reviewsData.results || []
          setReviews(list)
        }
      } catch {
        // ignore
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [productId])

  const gallery = useMemo(() => {
    const list = images.length ? images : product?.images || []
    return list
      .map((item) => (typeof item === 'string' ? item : item.image || item.url))
      .filter(Boolean)
      .map(resolveImageUrl)
  }, [images, product])

  useEffect(() => {
    if (gallery.length) {
      setSelectedImage(gallery[0])
    }
  }, [gallery])

  const handleAdd = async () => {
    if (!product) return
    try {
      await addItem(product.id, quantity)
    } catch {
      // ignore
    }
  }

  const handleReviewChange = (event) => {
    const { name, value } = event.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    setReviewStatus('loading')
    setReviewError('')

    try {
      const created = await storeApi.createReview(productId, reviewForm)
      setReviews((prev) => [created, ...prev])
      setReviewForm({ name: '', description: '' })
      setReviewStatus('ready')
    } catch (err) {
      setReviewStatus('error')
      setReviewError(getErrorMessage(err))
    }
  }

  if (status === 'loading') {
    return <LoadingState label={t('productDetail.loading')} />
  }

  if (status === 'error') {
    return (
      <EmptyState
        title={t('productDetail.unavailableTitle')}
        message={error}
        action={{ label: t('productDetail.backToMenu'), to: '/' }}
      />
    )
  }

  if (!product) return null

  const isOut = product.inventory <= 0
  const title = getLocalizedField(product.title, product.title_ar, language)
  const description = getLocalizedField(
    product.description,
    product.description_ar,
    language,
  )

  return (
    <div className="page">
      <section className="product-layout">
        <div className="product-gallery">
          <div className="product-gallery-main">
            {selectedImage ? (
              <img src={selectedImage} alt={title} />
            ) : (
              <div className="image-placeholder">{t('product.noImage')}</div>
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="product-thumbs">
              {gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={`product-thumb${
                    image === selectedImage ? ' product-thumb-active' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="product-info">
          <span className="eyebrow">{t('productDetail.label')}</span>
          <h1 className="product-title-lg">{title}</h1>
          <p className="muted">{description}</p>
          <div className="product-meta">
            <span className="price">
              {formatCurrency(product.unit_price, locale)}
            </span>
            <span className="price-muted">
              {formatCurrency(product.price_with_tax, locale)} {t('productDetail.incTax')}
            </span>
          </div>
          <div className="product-actions">
            <QuantityInput value={quantity} onChange={setQuantity} min={1} max={99} />
            <button
              className="button button-primary"
              type="button"
              onClick={handleAdd}
              disabled={isOut}
            >
              {isOut ? t('productDetail.outOfStock') : t('product.addToCart')}
            </button>
            <Link className="button button-outline" to="/cart">
              {t('productDetail.goToCart')}
            </Link>
          </div>
          <div className="product-meta-row">
            <span className="pill">
              {t('productDetail.inventory', { count: product.inventory })}
            </span>
            <span className="pill">
              {t('productDetail.sku', { id: product.id })}
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('productDetail.reviewsEyebrow')}</p>
            <h2 className="section-title">{t('productDetail.reviewsTitle')}</h2>
          </div>
          <div className="section-meta">
            {t('productDetail.reviewsCount', { count: reviews.length })}
          </div>
        </div>

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <label className="field">
            <span>{t('productDetail.reviewName')}</span>
            <input
              name="name"
              value={reviewForm.name}
              onChange={handleReviewChange}
              required
            />
          </label>
          <label className="field">
            <span>{t('productDetail.reviewText')}</span>
            <textarea
              name="description"
              rows="3"
              value={reviewForm.description}
              onChange={handleReviewChange}
              required
            ></textarea>
          </label>
          {reviewError ? <div className="alert">{reviewError}</div> : null}
          <button
            className="button button-primary"
            type="submit"
            disabled={reviewStatus === 'loading'}
          >
            {reviewStatus === 'loading'
              ? t('productDetail.posting')
              : t('productDetail.postReview')}
          </button>
        </form>

        <div className="review-list">
          {reviews.length === 0 ? (
            <EmptyState
              title={t('productDetail.noReviewsTitle')}
              message={t('productDetail.noReviewsMessage')}
            />
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span>{review.name}</span>
                  <span className="muted">{formatDate(review.date, locale)}</span>
                </div>
                <p className="muted">{review.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
