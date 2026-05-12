const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <div className="pagination-actions">
        <button
          className="button button-outline"
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="button button-outline"
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
