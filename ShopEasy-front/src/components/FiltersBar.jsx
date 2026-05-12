import { getLocalizedField, useLanguage } from '../context/LanguageContext'

const FiltersBar = ({ filters, collections, onChange, onReset }) => {
  const { t, language } = useLanguage()
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value })
  }

  return (
    <div className="filters-bar">
      <label className="field">
        <span>{t('filters.search')}</span>
        <input
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder={t('filters.searchPlaceholder')}
        />
      </label>
      <label className="field">
        <span>{t('filters.category')}</span>
        <select
          name="collectionId"
          value={filters.collectionId}
          onChange={handleChange}
        >
          <option value="">{t('filters.allCategories')}</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {getLocalizedField(
                collection.title,
                collection.title_ar,
                language,
              )}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>{t('filters.minPrice')}</span>
        <input
          type="number"
          min="0"
          name="priceMin"
          value={filters.priceMin}
          onChange={handleChange}
          placeholder="0"
        />
      </label>
      <label className="field">
        <span>{t('filters.maxPrice')}</span>
        <input
          type="number"
          min="0"
          name="priceMax"
          value={filters.priceMax}
          onChange={handleChange}
          placeholder="200"
        />
      </label>
      <label className="field">
        <span>{t('filters.sort')}</span>
        <select name="ordering" value={filters.ordering} onChange={handleChange}>
          <option value="">{t('filters.sortDefault')}</option>
          <option value="unit_price">{t('filters.sortLow')}</option>
          <option value="-unit_price">{t('filters.sortHigh')}</option>
          <option value="last_update">{t('filters.sortRecent')}</option>
          <option value="-last_update">{t('filters.sortOldest')}</option>
        </select>
      </label>
      <div className="filters-actions">
        <button className="button button-outline" type="button" onClick={onReset}>
          {t('filters.reset')}
        </button>
      </div>
    </div>
  )
}

export default FiltersBar
