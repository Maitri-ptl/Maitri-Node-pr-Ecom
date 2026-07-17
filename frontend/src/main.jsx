import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/user/UserContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </UserContextProvider>
)
