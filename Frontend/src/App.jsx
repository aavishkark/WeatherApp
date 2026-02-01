import './App.css'
import Navbar from './components/Navbar.jsx/Navbar'
import AllRoutes from './Routes/routes'
import FloatingControls from './components/FloatingControls/FloatingControls'
import AmbientBackground from './components/AmbientBackground/AmbientBackground'

function App() {
  return (
    <div className="App">
      <AmbientBackground />
      <Navbar />
      <AllRoutes />
      <FloatingControls />
    </div>
  )
}

export default App
