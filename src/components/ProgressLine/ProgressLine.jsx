import { useState } from 'react'
import styles from './ProgressLine.module.css'

function ProgressLine({ points = [], onPointClick }) {
  const [activePoint, setActivePoint] = useState(0)

  const handlePointClick = (index) => {
    setActivePoint(index)
    if (onPointClick) {
      onPointClick(index)
    }
  }

  return (
    <div className={styles.progressLine}>
      <div className={styles.progressLineLine}>
        {points.map((point, index) => (
          <div
            key={point.id || index}
            className={`${styles.progressLinePoint} ${
              activePoint === index ? styles.progressLinePointActive : ''
            }`}
            onClick={() => handlePointClick(index)}
          >
            <div 
              className={styles.progressLineLabel}
              dangerouslySetInnerHTML={{ __html: point.label || `Точка ${index + 1}` }}
            />
            <div className={styles.progressLineDot}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressLine

