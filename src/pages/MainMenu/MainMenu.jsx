import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './MainMenu.module.css'

const texts = [
  'Формирование традиций городской скульптуры в XVIII-XIX веках',
  'Принципы имперской монументальной пропаганды',
  'Роль памятников в формировании образа новой столицы'
]

function MainMenu() {
  const navigate = useNavigate()
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const handleNextText = () => {
    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
  }

  const handlePrevText = () => {
    setCurrentTextIndex((prev) => (prev - 1 + texts.length) % texts.length)
  }

  const handleDetails = () => {
    navigate('/submenu')
  }

  const handleCatalog = () => {
    navigate('/home')
  }

  const handleBack = () => {
    // Можно добавить логику возврата или оставить пустым
  }

  return (
    <div className={styles.mainMenu}>
      <Header />
      <div className={styles.mainMenuContent}>
        {/* Центральный блок с текстом */}
        <div className={styles.mainMenuCenter}>
          <div className={styles.mainMenuTextContainer}>
            <button 
              className={styles.mainMenuArrow}
              onClick={handlePrevText}
              aria-label="Предыдущий текст"
            >
              ‹
            </button>
            <div className={styles.mainMenuTextBlock}>
              <p className={styles.mainMenuText}>{texts[currentTextIndex]}</p>
              <button
                className={styles.mainMenuDetailsBtn}
                onClick={handleDetails}
              >
                Подробнее
              </button>
            </div>
        <button
              className={styles.mainMenuArrow}
              onClick={handleNextText}
              aria-label="Следующий текст"
            >
              ›
            </button>
          </div>
        </div>

        {/* Кнопка "Перейти в каталог" справа от центра */}
        <div className={styles.mainMenuCatalogBtnContainer}>
          <button 
            className={styles.mainMenuCatalogBtn}
            onClick={handleCatalog}
          >
            Перейти в каталог
          </button>
              </div>
              
        {/* Кнопка "Назад" внизу слева */}
        <div className={styles.mainMenuBottomNavigation}>
          <button 
            className={styles.mainMenuBackBtn}
            onClick={handleBack}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
