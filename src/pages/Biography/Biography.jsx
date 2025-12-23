import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import styles from './Biography.module.css'

function Biography() {
  const navigate = useNavigate()
  const [selectedArchitect, setSelectedArchitect] = useState(null)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [architects, setArchitects] = useState([])

  useEffect(() => {
    fetch('/data/architects.json')
      .then(res => res.json())
      .then(data => {
        setArchitects(data)
        // Автоматически выбираем первого архитектора по умолчанию
        if (data.length > 0) {
          setSelectedArchitect(data[0])
        }
      })
      .catch(err => console.error('Error loading architects:', err))
  }, [])

  const handleArchitectClick = (architect) => {
    setSelectedArchitect(architect)
  }

  const handleBack = () => {
    navigate('/')
  }

  const handlePrinciples = () => {
    navigate('/principles')
  }

  const handlePhotoClick = () => {
    if (selectedArchitect) {
      setShowFullscreen(true)
    }
  }

  const handleCloseFullscreen = () => {
    setShowFullscreen(false)
  }

  return (
    <div className={styles.biography}>
      
      

      <div className={styles.biographyContent}>
        <div className={styles.biographyLeftPanel}>
          <div className={styles.biographyButtons}>
            {/* 3 кнопки архитекторов */}
            {architects.map((architect) => (
              <button
                key={architect.id}
                className={`${styles.biographyBtn} ${styles.biographyBtnArchitect} ${
                  selectedArchitect?.id === architect.id ? styles.biographyBtnArchitectActive : ''
                }`}
                onClick={() => handleArchitectClick(architect)}
              >
                {architect.name}
              </button>
            ))}

            {/* Кнопка архитектурных принципов */}
            
        <div className={styles.biographyTopNavigation}>
        <button
              className={`${styles.biographyBtn} ${styles.biographyBtnPrinciples}`}
              onClick={handlePrinciples}
            >
              Архитектурные принципы и сравнения
            </button>
        <button className={`${styles.biographyTopBtn} ${styles.biographyTopBtnBack}`} onClick={handleBack}>
          Назад
        </button>
        
      </div>
          </div>
        </div>
        <div className={styles.biographyTitleBlock}>
          <h3 className={styles.biographyTitle}>БИОГРАФИЯ АРХИТЕКТОРА</h3>
          </div>
        <div className={styles.biographyRightPanel}>
          
          {selectedArchitect ? (
            <>
              <div className={styles.biographyInfo}>
                <h2 className={styles.biographyName}>{selectedArchitect.name}</h2>
              </div>
              
              <div 
                className={styles.biographyText}
                dangerouslySetInnerHTML={{ __html: `<p>${selectedArchitect.biography}</p>` }}
              />
              <div className={styles.biographyGallery}>
                <PhotoGallery
                  photos={selectedArchitect.photos}
                  showFullscreen={showFullscreen}
                  onCloseFullscreen={handleCloseFullscreen}
                  onImageClick={handlePhotoClick}
                  showControls={false}
                  showArrows={true}
                />
              </div>
            </>
          ) : (
            <div className={styles.biographyPlaceholder}>
              <p>Выберите архитектора, чтобы просмотреть его биографию и работы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Biography

