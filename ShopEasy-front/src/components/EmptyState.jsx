import { Link } from 'react-router-dom'

const EmptyState = ({ title, message, action }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    {message ? <p className="muted">{message}</p> : null}
    {action ? (
      action.to ? (
        <Link className="button button-primary" to={action.to}>
          {action.label}
        </Link>
      ) : (
        <button className="button button-primary" type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )
    ) : null}
  </div>
)

export default EmptyState
