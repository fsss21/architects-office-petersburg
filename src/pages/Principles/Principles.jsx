import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './Principles.module.css'

function Principles() {
  const navigate = useNavigate()
  const [principles, setPrinciples] = useState(null)
  const [palladianIndex, setPalladianIndex] = useState(0)
  const [russianIndex, setRussianIndex] = useState(0)

  useEffect(() => {
    fetch('/data/principles.json')
      .then(res => res.json())
      .then(data => setPrinciples(data))
      .catch(err => console.error('Error loading principles:', err))
  }, [])

  const handleBack = () => {
    navigate('/home')
  }

  const handleNextPalladian = () => {
    if (principles && principles.palladian.items.length > 0) {
      setPalladianIndex((prev) => (prev + 1) % principles.palladian.items.length)
    }
  }

  const handlePrevPalladian = () => {
    if (principles && principles.palladian.items.length > 0) {
      setPalladianIndex((prev) => (prev - 1 + principles.palladian.items.length) % principles.palladian.items.length)
    }
  }

  const handleNextRussian = () => {
    if (principles && principles.russian.items.length > 0) {
      setRussianIndex((prev) => (prev + 1) % principles.russian.items.length)
    }
  }

  const handlePrevRussian = () => {
    if (principles && principles.russian.items.length > 0) {
      setRussianIndex((prev) => (prev - 1 + principles.russian.items.length) % principles.russian.items.length)
    }
  }

  if (!principles) {
    return <div className={styles.principles}>Загрузка...</div>
  }

  const currentPalladian = principles.palladian.items[palladianIndex]
  const currentRussian = principles.russian.items[russianIndex]

  return (
    <div className={styles.principles}>
      <Header />
      <div className={styles.principlesContent}>
        <div className={styles.principlesColumns}>
          {/* Левая колонка - Палладианские принципы */}
          <div className={styles.principlesColumn}>
            <h2 className={styles.principlesTitle}>{principles.palladian.title}</h2>
            {currentPalladian && (
              <div className={styles.principlesItem}>
                <h3 className={styles.principlesItemTitle}>{currentPalladian.title}</h3>
                <p className={styles.principlesItemText}>{currentPalladian.text}</p>
                <div className={styles.principlesGallery}>
                  <PhotoGallery
                    photos={currentPalladian.photos}
                    showControls={false}
                    showArrows={false}
                    currentIndex={0}
                    onIndexChange={() => {}}
                  />
                  {currentPalladian.photos.length > 0 && (
                    <div className={styles.principlesGalleryControls}>
                      <button
                        className={styles.principlesGalleryNavBtn}
                        onClick={handlePrevPalladian}
                        disabled={principles.palladian.items.length <= 1}
                      >
                        ←
                      </button>
                      <span className={styles.principlesGalleryCounter}>
                        {palladianIndex + 1} / {principles.palladian.items.length}
                      </span>
                      <button
                        className={styles.principlesGalleryNavBtn}
                        onClick={handleNextPalladian}
                        disabled={principles.palladian.items.length <= 1}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - Русские адаптации */}
          <div className={styles.principlesColumn}>
            <h2 className={styles.principlesTitle}>{principles.russian.title}</h2>
            {currentRussian && (
              <div className={styles.principlesItem}>
                <h3 className={styles.principlesItemTitle}>{currentRussian.title}</h3>
                <p className={styles.principlesItemText}>{currentRussian.text}</p>
                <div className={styles.principlesGallery}>
                  <PhotoGallery
                    photos={currentRussian.photos}
                    showControls={false}
                    showArrows={false}
                    currentIndex={0}
                    onIndexChange={() => {}}
                  />
                  {currentRussian.photos.length > 0 && (
                    <div className={styles.principlesGalleryControls}>
                      <button
                        className={styles.principlesGalleryNavBtn}
                        onClick={handlePrevRussian}
                        disabled={principles.russian.items.length <= 1}
                      >
                        ←
                      </button>
                      <span className={styles.principlesGalleryCounter}>
                        {russianIndex + 1} / {principles.russian.items.length}
                      </span>
                      <button
                        className={styles.principlesGalleryNavBtn}
                        onClick={handleNextRussian}
                        disabled={principles.russian.items.length <= 1}
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка назад внизу страницы */}
      <div className={styles.principlesBottomNavigation}>
        <button className={`${styles.principlesBtn} ${styles.principlesBtnBack}`} onClick={handleBack}>
          Назад
        </button>
      </div>
    </div>
  )
}

export default Principles

