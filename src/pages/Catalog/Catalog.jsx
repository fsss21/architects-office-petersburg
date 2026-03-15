import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import Header from '../../components/Header/Header'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

// Маппинг года из creationTime в эпохи (по данным catalogItems.json)
const getErasFromCreationTime = (creationTime) => {
  if (!creationTime) return []
  const str = String(creationTime)
  const matches = str.match(/\d{4}/g)
  const years = matches ? matches.map((m) => parseInt(m, 10)) : []
  const eras = []
  years.forEach((year) => {
    if (year < 1800) eras.push('XVIII век')
    if (year >= 1800 && year < 1900) eras.push('XIX век')
    if (year >= 1900 && year < 2000) eras.push('XX век')
    if (year >= 1760 && year <= 1840) eras.push('Эпоха классицизма')
  })
  return [...new Set(eras)]
}

const matchesSearch = (item, query) => {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()
  const searchIn = [
    item.name,
    item.title,
    item.sculptor,
    item.material,
    item.location,
    item.creationTime,
    ...(Array.isArray(item.texts) ? item.texts : []),
  ].filter(Boolean).join(' ')
  return searchIn.toLowerCase().includes(q)
}

const parseMaterials = (str) => {
  if (!str || typeof str !== 'string') return []
  return str.split(/[,/]+/).map((s) => s.trim()).filter(Boolean)
}

const ITEMS_PER_PAGE = 4

function Catalog() {
  const navigate = useNavigate()
  const { selectedSculptors, selectedEras, selectedMaterials, searchQuery } = useCatalogFilter()
  const [pageIndex, setPageIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

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
        const itemMats = parseMaterials(item.material)
        const hasMaterial = selectedMaterials.some((m) => itemMats.includes(m))
        if (!hasMaterial) return false
      }
      if (!matchesSearch(item, searchQuery)) return false
      return true
    })
  }, [items, selectedSculptors, selectedEras, selectedMaterials, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const visibleItems = useMemo(() => {
    const start = pageIndex * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, pageIndex])

  useEffect(() => {
    setPageIndex((prev) => Math.min(prev, totalPages - 1))
  }, [filteredItems.length, totalPages])

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1)
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
              visibleItems.map((item, index) => {
                const photoUrl = item.photos && item.photos.length > 0 ? item.photos[0] : null
                const blockPositionClass =
                  index === 0 ? styles.catalogItemMiddle
                    : index === 1 ? ''
                      : index === 2 ? styles.catalogItemMiddle
                        : ''

                return (
                  <div
                    key={item.id}
                    className={`${styles.catalogItem} ${blockPositionClass}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className={styles.catalogItemImage}>
                      {photoUrl ? (
                        <img
                          src={photoUrl}
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

          {/* Стрелки: переключение между страницами по 4 предмета */}
          <div className={styles.catalogControls}>
            <button
              className={styles.catalogArrow}
              onClick={handlePrevPage}
              disabled={filteredItems.length === 0 || pageIndex === 0}
              aria-label="Предыдущая страница"
            >
              <ArrowBackIosNewIcon />
            </button>
            <button
              className={styles.catalogArrow}
              onClick={handleNextPage}
              disabled={filteredItems.length === 0 || pageIndex >= totalPages - 1}
              aria-label="Следующая страница"
            >
              <ArrowForwardIosIcon />
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
