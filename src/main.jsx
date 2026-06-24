import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";
// import { ThemeProvider } from "./ThemeContext";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      {/* <ThemeProvider> */}
        <App />
      {/* </ThemeProvider>   */}
    </HelmetProvider>
  </StrictMode>,
)