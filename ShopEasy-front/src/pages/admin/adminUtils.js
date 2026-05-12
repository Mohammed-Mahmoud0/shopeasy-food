export const STATUS_OPTIONS = ['P', 'R', 'O', 'D', 'X']
export const PRODUCT_PAGE_SIZE = 6
export const COLLECTION_PAGE_SIZE = 6
export const ORDER_PAGE_SIZE = 4

export const emptyProductForm = {
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  unit_price: '',
  inventory: '',
  collection: '',
  slug: '',
}

export const emptyCollectionForm = {
  title: '',
  title_ar: '',
}

export const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const toFormData = (field, file) => {
  const formData = new FormData()
  formData.append(field, file)
  return formData
}
