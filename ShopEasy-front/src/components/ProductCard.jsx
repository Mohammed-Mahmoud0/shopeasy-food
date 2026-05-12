import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'
import { getProductImage } from '../utils/images'
import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const ProductCard = ({ product, onAdd, collectionName }) => {
  const { t, language, locale } = useLanguage()
  const image = getProductImage(product.images)
  const isOut = product.inventory <= 0
  const title = getLocalizedField(product.title, product.title_ar, language)
  const description = getLocalizedField(
    product.description,
    product.description_ar,
    language,
  )

  const handleAdd = () => {
    if (onAdd) onAdd(product.id)
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="image-placeholder">{t('product.noImage')}</div>
        )}
      </Link>
      <div className="product-body">
        <div className="product-tag-row">
          {collectionName ? <span className="tag">{collectionName}</span> : null}
          <span className={`stock-pill ${isOut ? 'stock-out' : 'stock-in'}`}>
            {isOut ? t('product.outOfStock') : t('product.inStock')}
          </span>
        </div>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{title}</Link>
        </h3>
        <p className="product-desc">{description}</p>
        <div className="product-meta">
          <span className="price">
            {formatCurrency(product.unit_price, locale)}
          </span>
          <span className="price-muted">
            {formatCurrency(product.price_with_tax, locale)} {t('productDetail.incTax')}
          </span>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={handleAdd}
          disabled={isOut}
        >
          {t('product.addToCart')}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
