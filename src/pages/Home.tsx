import './Home.css'

function Home() {
  return (
    <div className="home">
      <h1>Добро пожаловать в React Museum</h1>
      <p className="subtitle">
        Изучайте React Router и создавайте потрясающие приложения
      </p>
      <div className="features">
        <div className="feature-card">
          <h2>🚀 Быстрая разработка</h2>
          <p>Используйте Vite для молниеносной разработки</p>
        </div>
        <div className="feature-card">
          <h2>🧭 Маршрутизация</h2>
          <p>React Router для навигации между страницами</p>
        </div>
        <div className="feature-card">
          <h2>⚡ Современный стек</h2>
          <p>TypeScript и React 18 для надежности</p>
        </div>
      </div>
    </div>
  )
}

export default Home

