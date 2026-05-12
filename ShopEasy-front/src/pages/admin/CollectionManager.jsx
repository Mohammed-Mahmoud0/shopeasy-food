import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { getLocalizedField } from '../../context/LanguageContext'

const CollectionManager = ({ admin }) => {
  const {
    t,
    language,
    filteredCollections,
    paginatedCollections,
    collectionSearch,
    setCollectionSearch,
    collectionPage,
    setCollectionPage,
    collectionTotalPages,
    collectionForm,
    savingCollection,
    editingCollectionId,
    resetCollectionForm,
    handleSubmitCollection,
    handleCollectionInput,
    handleEditCollection,
    handleDeleteCollection,
    deletingIds,
  } = admin

  return (
    <div className="admin-stack">
      <section className="admin-card admin-card-compact">
        <div className="card-heading">
          <div>
            <p className="eyebrow">{editingCollectionId ? t('admin.editCategory') : t('admin.addCategory')}</p>
            <h3 className="section-title">{t('admin.categoriesTitle')}</h3>
          </div>
          {editingCollectionId ? (
            <button className="button button-ghost" type="button" onClick={resetCollectionForm}>
              {t('admin.cancel')}
            </button>
          ) : null}
        </div>

        <input className="admin-search" value={collectionSearch} onChange={(event) => setCollectionSearch(event.target.value)} placeholder={t('admin.searchCollectionsPlaceholder')} />

        <form className="admin-form" onSubmit={handleSubmitCollection}>
          <div className="form-row">
            <label className="field">
              <span>{t('admin.fieldTitle')}</span>
              <input name="title" value={collectionForm.title} onChange={handleCollectionInput} required />
            </label>
            <label className="field">
              <span>{t('admin.titleAr')}</span>
              <input name="title_ar" value={collectionForm.title_ar} onChange={handleCollectionInput} />
            </label>
          </div>
          <button className="button button-primary" type="submit" disabled={savingCollection}>
            {savingCollection ? t('admin.updating') : t('admin.save')}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">{t('admin.categoriesTitle')}</p>
            <h3 className="section-title">{t('admin.categoriesTitle')}</h3>
          </div>
        </div>

        {filteredCollections.length === 0 ? (
          <EmptyState title={t('admin.noCategories')} />
        ) : (
          <>
            <div className="admin-list admin-list-grid">
              {paginatedCollections.map((collection) => (
                <div key={collection.id} className="admin-row admin-row-compact">
                  <div>
                    <strong>{getLocalizedField(collection.title, collection.title_ar, language)}</strong>
                    <div className="muted">ID {collection.id}</div>
                  </div>
                  <div className="card-actions">
                    <button className="button button-outline" type="button" onClick={() => handleEditCollection(collection)}>
                      {t('admin.update')}
                    </button>
                    <button className="button button-danger" type="button" onClick={() => handleDeleteCollection(collection)} disabled={deletingIds.includes(`collection-${collection.id}`)}>
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={collectionPage} totalPages={collectionTotalPages} onPageChange={setCollectionPage} />
          </>
        )}
      </section>
    </div>
  )
}

export default CollectionManager
