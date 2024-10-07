import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import ContextProvider from './contexts/Context.jsx'

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
