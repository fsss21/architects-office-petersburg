import { useState, useEffect } from 'react'
import styles from './PhotoGallery.module.css'

function PhotoGallery({ photos = [], showFullscreen = false, onCloseFullscreen, onImageClick, showControls = false, showArrows = false, currentIndex: externalIndex, onIndexChange }) {
  const [internalIndex, setInternalIndex] = useState(0)
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex

  useEffect(() => {
    if (showFullscreen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && onCloseFullscreen) {
          onCloseFullscreen()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showFullscreen, onCloseFullscreen])

  useEffect(() => {
    if (externalIndex !== undefined && externalIndex !== internalIndex) {
      setInternalIndex(externalIndex)
    }
  }, [externalIndex])

  const nextPhoto = () => {
    const newIndex = (currentIndex + 1) % photos.length
    if (onIndexChange) {
      onIndexChange(newIndex)
    } else {
      setInternalIndex(newIndex)
    }
  }

  const prevPhoto = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length
    if (onIndexChange) {
      onIndexChange(newIndex)
    } else {
      setInternalIndex(newIndex)
    }
  }

  const handleImageClick = () => {
    if (!showFullscreen && onImageClick) {
      onImageClick()
    }
  }

  if (photos.length === 0) {
    return <div className={`${styles.photoGallery} ${styles.photoGalleryEmpty}`}>Нет фотографий</div>
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div className={`${styles.photoGallery} ${showFullscreen ? styles.photoGalleryFullscreen : ''}`}>
      {showFullscreen && (
        <button className={styles.photoGalleryClose} onClick={onCloseFullscreen}>
          ✕
        </button>
      )}
      <div className={styles.photoGalleryContainer}>
        {showArrows && (
          <button
            className={`${styles.photoGalleryArrow} ${styles.photoGalleryArrowLeft}`}
            onClick={prevPhoto}
            aria-label="Предыдущее фото"
          >
            ‹
          </button>
        )}
        <div className={styles.photoGalleryImageWrapper}>
          <img
            src={currentPhoto}
            alt={`Фото ${currentIndex + 1}`}
            className={styles.photoGalleryImage}
            onClick={handleImageClick}
          />
        </div>
        {showArrows && (
          <button
            className={`${styles.photoGalleryArrow} ${styles.photoGalleryArrowRight}`}
            onClick={nextPhoto}
            aria-label="Следующее фото"
          >
            ›
          </button>
        )}
      </div>
      {showControls && !showFullscreen && (
        <div className={styles.photoGalleryControls}>
          <button
            className={styles.photoGalleryNavBtn}
            onClick={prevPhoto}
            disabled={photos.length <= 1}
          >
            ←
          </button>
          <span className={styles.photoGalleryCounter}>
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            className={styles.photoGalleryNavBtn}
            onClick={nextPhoto}
            disabled={photos.length <= 1}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export default PhotoGallery

