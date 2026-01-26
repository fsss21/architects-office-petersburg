import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './Home.module.css'

function Home() {
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
    <div className={styles.home}>
      <Header />
      <div className={styles.homeContent}>
        <div className={styles.homeLeftPanel}>
          <div className={styles.homeButtons}>
            {/* 3 кнопки архитекторов */}
            {architects.map((architect) => (
              <button
                key={architect.id}
                className={`${styles.homeBtn} ${styles.homeBtnArchitect} ${
                  selectedArchitect?.id === architect.id ? styles.homeBtnArchitectActive : ''
                }`}
                onClick={() => handleArchitectClick(architect)}
              >
                {architect.name}
              </button>
            ))}

            {/* Кнопка архитектурных принципов */}
            
        <div className={styles.homeTopNavigation}>
        <button
              className={`${styles.homeBtn} ${styles.homeBtnPrinciples}`}
              onClick={handlePrinciples}
            >
              Архитектурные принципы и сравнения
            </button>
        <button className={`${styles.homeTopBtn} ${styles.homeTopBtnBack}`} onClick={handleBack}>
          Назад
        </button>
        
      </div>
          </div>
        </div>
        <div className={styles.homeTitleBlock}>
          <h3 className={styles.homeTitle}>БИОГРАФИЯ АРХИТЕКТОРА</h3>
          </div>
        <div className={styles.homeRightPanel}>
          
          {selectedArchitect ? (
            <>
              <div className={styles.homeInfo}>
                <h2 className={styles.homeName}>{selectedArchitect.name}</h2>
              </div>
              
              <div 
                className={styles.homeText}
                dangerouslySetInnerHTML={{ __html: `<p>${selectedArchitect.biography}</p>` }}
              />
              <div className={styles.homeGallery}>
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
            <div className={styles.homePlaceholder}>
              <p>Выберите архитектора, чтобы просмотреть его биографию и работы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

