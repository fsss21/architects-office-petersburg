import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import Header from '../../components/Header/Header'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'
import petrImg from '../../assets/petr_img.png'
import columnAlexImg from '../../assets/column_alex_img.png'
import suvorovImg from '../../assets/suvorov_img.png'
import barklayImg from '../../assets/barklay_img.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

// Маппинг года из creationTime в эпохи (по данным catalogItems.json)
const getErasFromCreationTime = (creationTime) => {
  if (!creationTime) return []
  const match = String(creationTime).match(/\d{4}/)
  const year = match ? parseInt(match[0], 10) : null
  if (year === null) return []
  const eras = []
  if (year < 1800) eras.push('XVIII век')
  if (year >= 1800 && year < 1900) eras.push('XIX век')
  if (year >= 1760 && year <= 1840) eras.push('Эпоха классицизма')
  return eras
}

const matchesSearch = (item, query) => {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()
  const searchIn = [
    item.name,
    item.title,
    item.sculptor,
    item.location,
    item.creationTime,
    ...(Array.isArray(item.texts) ? item.texts : []),
  ].filter(Boolean).join(' ')
  return searchIn.toLowerCase().includes(q)
}

function Catalog() {
  const navigate = useNavigate()
  const { selectedSculptors, selectedEras, selectedMaterials, searchQuery } = useCatalogFilter()
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

  // Маппинг изображений по названиям памятников
  const monumentImages = {
    'Медный всадник': petrImg,
    'Александровская колонна': columnAlexImg,
    'Памятник Суворову': suvorovImg,
    'Памятник Барклаю де Толли': barklayImg
  }

  useEffect(() => {
    // Определяем, нужно ли использовать 4K изображение
    // Для экранов с шириной >= 2560px или высотой >= 1440px используем 4K версию
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogImg4k : catalogImg)

    // Загружаем предметы каталога из JSON файла
    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        setItems(data)
      })
      .catch(err => console.error('Error loading catalog items:', err))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedSculptors.length > 0 && !selectedSculptors.includes(item.sculptor)) return false
      if (selectedEras.length > 0) {
        const itemEras = getErasFromCreationTime(item.creationTime)
        const hasEra = selectedEras.some((era) => itemEras.includes(era))
        if (!hasEra) return false
      }
      if (selectedMaterials.length > 0) {
        const material = item.material || ''
        if (!selectedMaterials.includes(material)) return false
      }
      if (!matchesSearch(item, searchQuery)) return false
      return true
    })
  }, [items, selectedSculptors, selectedEras, selectedMaterials, searchQuery])

  useEffect(() => {
    setCurrentItemIndex((prev) => Math.min(prev, Math.max(0, filteredItems.length - 1)))
  }, [filteredItems.length])

  const handleNextItem = () => {
    if (filteredItems.length > 0 && currentItemIndex < filteredItems.length - 1) {
      setCurrentItemIndex((prev) => prev + 1)
    }
  }

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1)
    }
  }

  const handleItemClick = (item) => {
    // При клике на предмет открываем страницу с предметом
    navigate(`/catalog/${item.id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={styles.catalog}>
      <div 
        className={styles.catalogBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogContent}>
        {/* Центральная область с предметами */}
        <div className={styles.catalogCenter}>
          <div className={styles.catalogItemsContainer}>
            {filteredItems.length === 0 ? (
              <p className={styles.catalogEmpty}>По вашему запросу ничего не найдено. Измените фильтры или поиск.</p>
            ) : (
            filteredItems.map((item, index) => {
              // Определяем класс позиционирования блока в зависимости от id
              let blockPositionClass = ''
              if (item.id === 1) {
                // Медный всадник (Петр) - выше
                blockPositionClass = styles.catalogItemTop
              } else if (item.id === 3) {
                // Памятник Суворову - выше колонны
                blockPositionClass = styles.catalogItemMiddle
              } else {
                // Колонна (id: 2) и Барклай (id: 4) - стандартное позиционирование
                blockPositionClass = styles.catalogItemBottom
              }

              return (
                <div
                  key={item.id}
                  className={`${styles.catalogItem} ${blockPositionClass} ${
                    index === currentItemIndex ? styles.catalogItemActive : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                <div className={styles.catalogItemImage}>
                  {monumentImages[item.name] ? (
                    <img 
                      src={monumentImages[item.name]} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : item.photos && item.photos.length > 0 ? (
                    <img 
                      src={item.photos[0]} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : null}
                </div>
                <div className={styles.catalogItemOverlay}>
                  <h3 
                    className={styles.catalogItemTitle}
                    dangerouslySetInnerHTML={{ __html: item?.title || '' }}
                  />
                </div>
              </div>
              )
            })
            )}
          </div>

          {/* Стрелочки для переключения между предметами - по середине страницы */}
          <div className={styles.catalogControls}>
            <button 
              className={styles.catalogArrow}
              onClick={handlePrevItem}
              disabled={filteredItems.length === 0 || currentItemIndex === 0}
              aria-label="Предыдущий предмет"
            >
              <ArrowBackIosNewIcon/>
            </button>
            <button
              className={styles.catalogArrow}
              onClick={handleNextItem}
              disabled={filteredItems.length === 0 || currentItemIndex === filteredItems.length - 1}
              aria-label="Следующий предмет"
            >
              <ArrowForwardIosIcon/>
            </button>
          </div>
        </div>

        {/* Кнопка "Назад" внизу слева */}
        <div className={styles.catalogBottomNavigation}>
          <button 
            className={styles.catalogBackBtn}
            onClick={handleBack}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default Catalog
