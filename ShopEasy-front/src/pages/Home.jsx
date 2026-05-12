import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { storeApi } from '../api/store'
import FiltersBar from '../components/FiltersBar'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { useDebounce } from '../hooks/useDebounce'
import { getErrorMessage } from '../utils/format'
import { useCart } from '../context/CartContext'
import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const PAGE_SIZE = 12

const Home = () => {
  const { addItem } = useCart()
  const { t, language } = useLanguage()
  const [collections, setCollections] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    collectionId: '',
    priceMin: '',
    priceMax: '',
    ordering: '',
  })
  const [page, setPage] = useState(1)
  const [catalog, setCatalog] = useState({ results: [], count: 0 })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const debouncedSearch = useDebounce(filters.search, 400)

  useEffect(() => {
    let ignore = false

    storeApi
      .listCollections()
      .then((data) => {
        if (ignore) return
        const list = Array.isArray(data) ? data : data.results || []
        setCollections(list)
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [
    debouncedSearch,
    filters.collectionId,
    filters.priceMin,
    filters.priceMax,
    filters.ordering,
  ])

  const query = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      collection_id: filters.collectionId || undefined,
      unit_price__gt: filters.priceMin || undefined,
      unit_price__lt: filters.priceMax || undefined,
      ordering: filters.ordering || undefined,
    }),
    [
      page,
      debouncedSearch,
      filters.collectionId,
      filters.priceMin,
      filters.priceMax,
      filters.ordering,
    ],
  )

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setError('')

    storeApi
      .listProducts(query)
      .then((data) => {
        if (ignore) return
        setCatalog({ results: data.results || [], count: data.count || 0 })
        setStatus('ready')
      })
      .catch((err) => {
        if (ignore) return
        setStatus('error')
        setError(getErrorMessage(err))
      })

    return () => {
      ignore = true
    }
  }, [query])

  const totalPages = Math.max(1, Math.ceil((catalog.count || 0) / PAGE_SIZE))
  const collectionMap = useMemo(
    () =>
      new Map(
        collections.map((collection) => [
          String(collection.id),
          getLocalizedField(collection.title, collection.title_ar, language),
        ]),
      ),
    [collections, language],
  )

  const handleReset = () =>
    setFilters({
      search: '',
      collectionId: '',
      priceMin: '',
      priceMax: '',
      ordering: '',
    })

  const handleAdd = async (productId) => {
    try {
      await addItem(productId, 1)
    } catch {
      // ignore
    }
  }

  const highlights = collections.slice(0, 4)

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">{t('home.heroEyebrow')}</span>
          <h1 className="hero-title">{t('home.heroTitle')}</h1>
          <p className="hero-copy">{t('home.heroCopy')}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#catalog">
              {t('home.heroBrowse')}
            </a>
            <Link className="button button-outline" to="/cart">
              {t('home.heroCart')}
            </Link>
          </div>
          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-value">{t('home.metricOneValue')}</span>
              <span className="metric-label">{t('home.metricOneLabel')}</span>
            </div>
            <div className="metric">
              <span className="metric-value">{t('home.metricTwoValue')}</span>
              <span className="metric-label">{t('home.metricTwoLabel')}</span>
            </div>
            <div className="metric">
              <span className="metric-value">{t('home.metricThreeValue')}</span>
              <span className="metric-label">{t('home.metricThreeLabel')}</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <h3 className="hero-card-title">{t('home.highlightsTitle')}</h3>
          <ul className="hero-list">
            {highlights.length ? (
              highlights.map((collection) => (
                <li key={collection.id} className="hero-list-item">
                  <span>
                    {getLocalizedField(
                      collection.title,
                      collection.title_ar,
                      language,
                    )}
                  </span>
                  <span className="hero-pill">
                    {t('home.itemsLabel', { count: collection.products_count })}
                  </span>
                </li>
              ))
            ) : (
              <>
                <li className="hero-list-item">
                  <span>{t('home.highlightsLoading')}</span>
                  <span className="hero-pill">{t('home.highlightsLoading')}</span>
                </li>
                <li className="hero-list-item">
                  <span>{t('home.highlightsLoading')}</span>
                  <span className="hero-pill">{t('home.highlightsLoading')}</span>
                </li>
                <li className="hero-list-item">
                  <span>{t('home.highlightsLoading')}</span>
                  <span className="hero-pill">{t('home.highlightsLoading')}</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      <section className="section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('home.catalogEyebrow')}</p>
            <h2 className="section-title">{t('home.catalogTitle')}</h2>
          </div>
          <div className="section-meta">
            {t('home.catalogMeta', { count: catalog.count })}
          </div>
        </div>

        <FiltersBar
          filters={filters}
          collections={collections}
          onChange={setFilters}
          onReset={handleReset}
        />

        {status === 'loading' ? (
          <LoadingState label={t('common.loading')} />
        ) : status === 'error' ? (
          <EmptyState title={t('home.loadErrorTitle')} message={error} />
        ) : catalog.results.length === 0 ? (
          <EmptyState
            title={t('home.emptyTitle')}
            message={t('home.emptyMessage')}
          />
        ) : (
          <div className="catalog-grid">
            {catalog.results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
                collectionName={collectionMap.get(String(product.collection))}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  )
}

export default Home
