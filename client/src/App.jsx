import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './pages/landing'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/modal/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route 
          path="/dashboard" 
          element={
              <ProtectedRoute>
                  <Dashboard />
              </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
