import { useState, useEffect } from 'react'
import styles from './VideoPreview.module.css'

function VideoPreview({ onComplete }) {
  const [showVideo, setShowVideo] = useState(true)
  const [videoError, setVideoError] = useState(false)

  const handleVideoEnd = () => {
    setShowVideo(false)
    if (onComplete) {
      onComplete()
    }
  }

  const handleVideoError = () => {
    setVideoError(true)
    // Если видео не загрузилось, автоматически пропускаем заставку через 2 секунды
    setTimeout(() => {
      setShowVideo(false)
      if (onComplete) {
        onComplete()
      }
    }, 2000)
  }

  const handleSkip = () => {
    setShowVideo(false)
    if (onComplete) {
      onComplete()
    }
  }

  useEffect(() => {
    // Автоматически пропускаем видео через 10 секунд, если оно не закончилось
    const timer = setTimeout(() => {
      if (showVideo) {
        setShowVideo(false)
        if (onComplete) {
          onComplete()
        }
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [showVideo, onComplete])

  if (!showVideo) return null

  return (
    <div className={styles.videoPreview}>
      {videoError && (
        <div className={styles.videoPreviewError}>
          <p>Видео не найдено</p>
          <button onClick={handleSkip} className={styles.videoPreviewSkip}>
            Пропустить
          </button>
        </div>
      )}
      <video
        className={styles.videoPreviewVideo}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        playsInline
      >
        <source src="/preview.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      
    </div>
  )
}

export default VideoPreview

