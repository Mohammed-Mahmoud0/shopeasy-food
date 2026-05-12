const LoadingState = ({ label = 'Loading...' }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true"></span>
    <p>{label}</p>
  </div>
)

export default LoadingState
