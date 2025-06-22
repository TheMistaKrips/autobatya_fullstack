import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css' // Импортируем main.css вместо index.css
import 'antd/dist/reset.css' // Сброс стилей Ant Design

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)