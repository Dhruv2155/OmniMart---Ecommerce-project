import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'
import { Provider } from 'react-redux'
import store from './redux/store'

createRoot(document.getElementById('root')).render(
 <Provider store={store}>

    <AuthProvider>
    <App />
    </AuthProvider>
  </Provider>,
)
