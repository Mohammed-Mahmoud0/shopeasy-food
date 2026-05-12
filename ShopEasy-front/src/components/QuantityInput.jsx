const clampValue = (value, min, max) =>
  Math.min(max, Math.max(min, Number(value)))

const QuantityInput = ({ value, onChange, min = 1, max = 99 }) => {
  const handleChange = (event) => {
    const next = clampValue(event.target.value || min, min, max)
    onChange(next)
  }

  const handleStep = (delta) => {
    const next = clampValue(value + delta, min, max)
    onChange(next)
  }

  return (
    <div className="qty-control">
      <button type="button" onClick={() => handleStep(-1)}>
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <button type="button" onClick={() => handleStep(1)}>
        +
      </button>
    </div>
  )
}

export default QuantityInput
