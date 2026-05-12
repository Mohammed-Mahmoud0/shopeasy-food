import { orderStatusLabel } from '../utils/format'

const STATUS_STEPS = ['P', 'R', 'O', 'D']

const OrderStatusTracker = ({ status, language }) => {
  const activeIndex = STATUS_STEPS.indexOf(status)
  const isCancelled = status === 'X'

  return (
    <div className={`status-tracker${isCancelled ? ' status-tracker-cancelled' : ''}`}>
      {STATUS_STEPS.map((code, index) => (
        <div
          key={code}
          className={`status-step${index <= activeIndex ? ' status-step-active' : ''}`}
        >
          <span className="status-dot" />
          <span className="status-label">{orderStatusLabel(code, language)}</span>
        </div>
      ))}
      {isCancelled ? (
        <span className="status-cancelled">{orderStatusLabel('X', language)}</span>
      ) : null}
    </div>
  )
}

export default OrderStatusTracker
