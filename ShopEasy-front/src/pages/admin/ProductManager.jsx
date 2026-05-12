import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { getLocalizedField } from '../../context/LanguageContext'
import { formatCurrency } from '../../utils/format'
import { resolveImageUrl } from '../../utils/images'

const ProductManager = ({ admin }) => {
  const {
    t,
    language,
    locale,
    filteredProducts,
    paginatedProducts,
    productSearch,
    setProductSearch,
    productPage,
    setProductPage,
    productTotalPages,
    productForm,
    savingProduct,
    editingProductId,
    resetProductForm,
    handleSubmitProduct,
    handleProductInput,
    productOptions,
    handleEditProduct,
    handleDeleteProduct,
    deletingIds,
    productImageFiles,
    handleProductImageSelect,
    replaceProductImage,
    removeProductImage,
    findCollection,
  } = admin

  return (
    <div className="admin-stack">
      <section className="admin-card admin-card-compact">
        <div className="card-heading">
          <div>
            <p className="eyebrow">{editingProductId ? t('admin.editProduct') : t('admin.addProduct')}</p>
            <h3 className="section-title">{t('admin.productsTitle')}</h3>
          </div>
          {editingProductId ? (
            <button className="button button-ghost" type="button" onClick={resetProductForm}>
              {t('admin.cancel')}
            </button>
          ) : null}
        </div>

        <form className="admin-form" onSubmit={handleSubmitProduct}>
          <div className="form-row">
            <label className="field">
              <span>{t('admin.fieldTitle')}</span>
              <input name="title" value={productForm.title} onChange={handleProductInput} required />
            </label>
            <label className="field">
              <span>{t('admin.titleAr')}</span>
              <input name="title_ar" value={productForm.title_ar} onChange={handleProductInput} />
            </label>
          </div>
          <div className="form-row">
            <label className="field">
              <span>{t('admin.slug')}</span>
              <input name="slug" value={productForm.slug} onChange={handleProductInput} />
            </label>
            <label className="field">
              <span>{t('admin.category')}</span>
              <select name="collection" value={productForm.collection} onChange={handleProductInput} required>
                <option value="">{t('admin.noCategory')}</option>
                {productOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label className="field field-wide">
              <span>{t('admin.description')}</span>
              <textarea name="description" rows="3" value={productForm.description} onChange={handleProductInput} />
            </label>
            <label className="field field-wide">
              <span>{t('admin.descriptionAr')}</span>
              <textarea name="description_ar" rows="3" value={productForm.description_ar} onChange={handleProductInput} />
            </label>
          </div>
          <div className="form-row">
            <label className="field">
              <span>{t('admin.price')}</span>
              <input type="number" step="0.01" min="0" name="unit_price" value={productForm.unit_price} onChange={handleProductInput} required />
            </label>
            <label className="field">
              <span>{t('admin.inventory')}</span>
              <input type="number" min="0" name="inventory" value={productForm.inventory} onChange={handleProductInput} required />
            </label>
          </div>
          <div className="form-row">
            <label className="field field-wide">
              <span>{t('admin.images')}</span>
              <input type="file" accept="image/*" onChange={(event) => handleProductImageSelect(editingProductId ? `form-${editingProductId}` : 'formNew', event.target.files?.[0] || null)} />
              <span className="helper-text">{t('admin.uploadImage')}</span>
            </label>
          </div>
          <button className="button button-primary" type="submit" disabled={savingProduct}>
            {savingProduct ? t('admin.updating') : t('admin.save')}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">{t('admin.productsTitle')}</p>
            <h3 className="section-title">{t('admin.productsTitle')}</h3>
          </div>
          <input className="admin-search" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder={t('admin.searchPlaceholder')} />
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState title={t('admin.noProducts')} />
        ) : (
          <>
            <div className="admin-product-grid">
              {paginatedProducts.map((product) => {
                const title = getLocalizedField(product.title, product.title_ar, language)
                const description = getLocalizedField(product.description, product.description_ar, language) || t('admin.noDescription')
                const collectionName = findCollection(product.collection)
                const isDeleting = deletingIds.includes(`product-${product.id}`)
                const images = product.images || []

                return (
                  <article key={product.id} className="admin-product-card">
                    <div className="admin-product-top">
                      <div>
                        <p className="eyebrow">
                          {collectionName ? getLocalizedField(collectionName.title, collectionName.title_ar, language) : t('admin.noCategory')}
                        </p>
                        <h4 className="admin-product-title">{title}</h4>
                      </div>
                      <div className="admin-product-price">{formatCurrency(product.unit_price, locale)}</div>
                    </div>

                    <div className="admin-product-image-strip">
                      {images.length === 0 ? (
                        <div className="admin-product-image-empty">{t('product.noImage')}</div>
                      ) : (
                        images.map((image) => {
                          const imageUrl = resolveImageUrl(image.image || image.url || '')
                          const imageKey = `product-${product.id}-image-${image.id}`
                          const pendingFile = productImageFiles[imageKey]

                          return (
                            <div key={image.id} className="admin-product-image-card">
                              <div className="admin-product-image-preview">
                                <img src={imageUrl} alt={title} />
                              </div>
                              <div className="admin-image-actions">
                                <label htmlFor={`file-${imageKey}`} className="button button-sm button-outline">
                                  {pendingFile ? pendingFile.name : t('admin.chooseFile')}
                                </label>
                                <input id={`file-${imageKey}`} type="file" accept="image/*" onChange={(event) => handleProductImageSelect(imageKey, event.target.files?.[0] || null)} className="admin-file-input" />
                              </div>
                              <div className="admin-image-buttons">
                                <button className="button button-sm button-outline" type="button" onClick={() => replaceProductImage(product.id, image.id, imageKey)} disabled={!pendingFile}>
                                  {t('admin.save')}
                                </button>
                                <button className="button button-sm button-danger" type="button" onClick={() => removeProductImage(product.id, image.id)}>
                                  {t('admin.removeImage')}
                                </button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>

                    <p className="admin-product-description">{description}</p>

                    <div className="admin-product-stats">
                      <span className="pill">{t('admin.inventory')}: {product.inventory}</span>
                      <span className="pill">ID {product.id}</span>
                    </div>

                    <div className="card-actions card-actions-stretch">
                      <button className="button button-outline" type="button" onClick={() => handleEditProduct(product)}>
                        {t('admin.update')}
                      </button>
                      <button className="button button-danger" type="button" onClick={() => handleDeleteProduct(product)} disabled={isDeleting}>
                        {t('admin.delete')}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            <Pagination page={productPage} totalPages={productTotalPages} onPageChange={setProductPage} />
          </>
        )}
      </section>
    </div>
  )
}

export default ProductManager
