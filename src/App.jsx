import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import VideoPreview from './components/VideoPreview/VideoPreview'
import MainMenu from './pages/MainMenu/MainMenu'
import SubMenu from './pages/SubMenu/SubMenu'
import Principles from './pages/Principles/Principles'
import Home from './pages/Home/Home'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showVideo, setShowVideo] = useState(true)

  useEffect(() => {
    // При перезагрузке страницы всегда перенаправляем на MainMenu (главную страницу)
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Выполняется только при монтировании

  const handleVideoComplete = () => {
    setShowVideo(false)
  }

  return (
    <>
      {showVideo && <VideoPreview onComplete={handleVideoComplete} />}
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/submenu" element={<SubMenu />} />
        <Route path="/home" element={<Home />} />
        <Route path="/principles" element={<Principles />} />
      </Routes>
    </>
  )
}

function App() {
  return <AppContent />
}

export default App
