import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import VideoPreview from './components/VideoPreview/VideoPreview'
import Home from './pages/Home/Home'
import Biography from './pages/Biography/Biography'
import Principles from './pages/Principles/Principles'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showVideo, setShowVideo] = useState(true)

  useEffect(() => {
    // При перезагрузке страницы всегда перенаправляем на Home
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, []) // Пустой массив зависимостей - выполняется только при монтировании

  const handleVideoComplete = () => {
    setShowVideo(false)
  }

  return (
    <>
      {showVideo && <VideoPreview onComplete={handleVideoComplete} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biography" element={<Biography />} />
        <Route path="/principles" element={<Principles />} />
      </Routes>
    </>
  )
}

function App() {
  return <AppContent />
}

export default App
