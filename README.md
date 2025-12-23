# React Museum

Современное React приложение с React Router для навигации между страницами.

## Технологии

- ⚛️ React 18
- 🧭 React Router DOM v6
- ⚡ Vite
- 📘 TypeScript
- 🎨 CSS3

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:5173](http://localhost:5173)

## Сборка

```bash
npm run build
```

## Структура проекта

```
react-museum/
├── src/
│   ├── components/      # Переиспользуемые компоненты
│   │   └── Layout.tsx   # Компонент макета с навигацией
│   ├── pages/           # Страницы приложения
│   │   ├── Home.tsx     # Главная страница
│   │   └── About.tsx    # Страница "О нас"
│   ├── App.tsx          # Главный компонент с роутингом
│   ├── main.tsx         # Точка входа
│   └── index.css        # Глобальные стили
├── index.html
└── package.json
```

## Роутинг

Маршруты определены в `src/App.tsx`:
- `/` - Главная страница
- `/about` - Страница "О нас"

Вы можете легко добавить новые маршруты, создав новые компоненты страниц и добавив их в `App.tsx`.

