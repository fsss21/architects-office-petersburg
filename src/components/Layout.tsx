import { Link } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            React Museum
          </Link>
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                Главная
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                О нас
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

