import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressLine from '../../components/ProgressLine/ProgressLine'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import styles from './Home.module.css'

function Home() {
  const navigate = useNavigate()
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [progressPoints, setProgressPoints] = useState([])
  const [homePhotos, setHomePhotos] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    fetch('/data/progressPoints.json')
      .then(res => res.json())
      .then(data => setProgressPoints(data))
      .catch(err => console.error('Error loading progress points:', err))

    fetch('/data/homePhotos.json')
      .then(res => res.json())
      .then(data => setHomePhotos(data))
      .catch(err => console.error('Error loading photos:', err))
  }, [])

  const handlePointClick = (index) => {
    setSelectedPoint(index)
  }

  const handleBack = () => {
    // Логика кнопки "Назад"
    console.log('Назад')
  }

  const handleMainMenu = () => {
    navigate('/biography')
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % homePhotos.length)
  }

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + homePhotos.length) % homePhotos.length)
  }

  const currentPoint = progressPoints[selectedPoint]

  return (
    <div className={styles.home}>
      <div className={styles.homeContent}>
        {/* Прогресс линия */}
        <ProgressLine points={progressPoints} onPointClick={handlePointClick} />
        {/* Основной контент: текст слева, галерея справа */}
        <div className={styles.homeMainContent}>
          <div className={styles.homeMainContentMenu}>
            <div className={styles.homeTextBlock}>
              <h2>О проекте</h2>
              <p>
                Это уникальная коллекция работ выдающихся архитекторов, которые
                изменили облик городов и повлияли на развитие архитектуры во всем мире.
              </p>
              {currentPoint && (
                <p 
                  className={styles.homeTextPoint}
                  dangerouslySetInnerHTML={{ __html: `<strong>${currentPoint.label}</strong>` }}
                />
              )}
            </div>
            {/* Кнопки навигации внизу страницы */}
            <div className={styles.homeBottomNavigation}>
              <button className={`${styles.homeBtn} ${styles.homeBtnBack}`} onClick={handleBack}>
                Назад
              </button>
              <button className={`${styles.homeBtn} ${styles.homeBtnMainMenu}`} onClick={handleMainMenu}>
                Главное меню
              </button>
            </div>
          </div>

          <div className={styles.homeGalleryBlock}>
            <div className={styles.homeGalleryWrapper}>
              <PhotoGallery 
                photos={homePhotos} 
                showControls={false} 
                showArrows={false}
                currentIndex={currentPhotoIndex}
                onIndexChange={setCurrentPhotoIndex}
              />
            </div>
            {homePhotos.length > 0 && (
              <div className={styles.homeGalleryControls}>
                <button 
                  className={styles.homeGalleryNavBtn}
                  onClick={handlePrevPhoto}
                  disabled={homePhotos.length <= 1}
                >
                  ←
                </button>
                <span className={styles.homeGalleryCounter}>
                  {currentPhotoIndex + 1} / {homePhotos.length}
                </span>
                <button 
                  className={styles.homeGalleryNavBtn}
                  onClick={handleNextPhoto}
                  disabled={homePhotos.length <= 1}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
    </div>
  )
}

export default Home

