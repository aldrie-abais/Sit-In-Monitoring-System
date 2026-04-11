import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './pages/landing'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/modal/ProtectedRoute'
import AdminStudents from './pages/AdminStudents'
import AdminRecords from './pages/AdminRecords'
import StudentHistory from './pages/StudentHistory'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Student Dashboard */}
        <Route 
          path="/dashboard" 
          element={
              <ProtectedRoute allowedRoles={['Student']}>
                  <Dashboard />
              </ProtectedRoute>
          } 
        />

        {/* NEW: Student History Page */}
        <Route 
          path="/history" 
          element={
              <ProtectedRoute allowedRoles={['Student']}>
                  <StudentHistory />
              </ProtectedRoute>
          } 
        />

        {/* Main Admin Dashboard */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> 

        {/* Admin Students List (Nested URL) */}
        <Route 
          path="/admin-dashboard/students" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminStudents />
            </ProtectedRoute>
          } 
        /> 

        <Route 
          path="/admin-dashboard/records" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminRecords />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App