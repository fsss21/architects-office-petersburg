import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressLine from '../../components/ProgressLine/ProgressLine'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './SubMenu.module.css'

function SubMenu() {
  const navigate = useNavigate()
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [progressPoints, setProgressPoints] = useState([])
  const [subMenuPhotos, setSubMenuPhotos] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    fetch('/data/progressPoints.json')
      .then(res => res.json())
      .then(data => setProgressPoints(data))
      .catch(err => console.error('Error loading progress points:', err))

    fetch('/data/homePhotos.json')
      .then(res => res.json())
      .then(data => {
        setSubMenuPhotos(data)
        setCurrentPhotoIndex(0) // Сбрасываем индекс при загрузке новых фото
      })
      .catch(err => console.error('Error loading photos:', err))
  }, [])

  const handlePointClick = (index) => {
    if (index >= 0 && index < progressPoints.length) {
      setSelectedPoint(index)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleMainMenu = () => {
    navigate('/home')
  }

  const handleNextPhoto = () => {
    if (subMenuPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % subMenuPhotos.length)
    }
  }

  const handlePrevPhoto = () => {
    if (subMenuPhotos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + subMenuPhotos.length) % subMenuPhotos.length)
    }
  }

  const currentPoint = progressPoints[selectedPoint]

  return (
    <div className={styles.subMenu}>
      <Header />
      <div className={styles.subMenuContent}>
        {/* Прогресс линия */}
        <ProgressLine points={progressPoints} onPointClick={handlePointClick} />
        {/* Основной контент: текст слева, галерея справа */}
        <div className={styles.subMenuMainContent}>
          <div className={styles.subMenuMainContentMenu}>
            <div className={styles.subMenuTextBlock}>
              <h2>О проекте</h2>
              <p>
                Это уникальная коллекция работ выдающихся архитекторов, которые
                изменили облик городов и повлияли на развитие архитектуры во всем мире.
              </p>
              {currentPoint && (
                <p 
                  className={styles.subMenuTextPoint}
                  dangerouslySetInnerHTML={{ __html: `<strong>${currentPoint.label}</strong>` }}
                />
              )}
            </div>
            {/* Кнопки навигации внизу страницы */}
            <div className={styles.subMenuBottomNavigation}>
              <button className={`${styles.subMenuBtn} ${styles.subMenuBtnBack}`} onClick={handleBack}>
                Назад
              </button>
              <button className={`${styles.subMenuBtn} ${styles.subMenuBtnMainMenu}`} onClick={handleMainMenu}>
                Главное меню
              </button>
            </div>
          </div>

          <div className={styles.subMenuGalleryBlock}>
            <div className={styles.subMenuGalleryWrapper}>
              <PhotoGallery 
                photos={subMenuPhotos} 
                showControls={false} 
                showArrows={false}
                currentIndex={currentPhotoIndex}
                onIndexChange={setCurrentPhotoIndex}
              />
            </div>
            {subMenuPhotos.length > 0 && (
              <div className={styles.subMenuGalleryControls}>
                <button 
                  className={styles.subMenuGalleryNavBtn}
                  onClick={handlePrevPhoto}
                  disabled={subMenuPhotos.length <= 1}
                >
                  ←
                </button>
                <span className={styles.subMenuGalleryCounter}>
                  {currentPhotoIndex + 1} / {subMenuPhotos.length}
                </span>
                <button 
                  className={styles.subMenuGalleryNavBtn}
                  onClick={handleNextPhoto}
                  disabled={subMenuPhotos.length <= 1}
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

export default SubMenu
