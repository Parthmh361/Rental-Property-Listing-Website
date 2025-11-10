import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NewProperty from './pages/NewProperty'
import EditProperty from './pages/EditProperty'
import PropertyDetail from './pages/PropertyDetail'
import MyProperties from './pages/MyProperties'
import BrowseProperties from './pages/BrowseProperties'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse" element={<BrowseProperties />} />
        <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
        <Route path="/properties/new" element={<ProtectedRoute><NewProperty /></ProtectedRoute>} />
        <Route path="/properties/:id/edit" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        {/* Example protected route usage (if later you add dashboard): */}
        <Route path="/dashboard" element={<ProtectedRoute><div className="container py-5">Private Dashboard</div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="bg-light py-4 mt-auto border-top">
        <div className="container d-flex justify-content-between">
          <div className="text-muted">© {new Date().getFullYear()} Rentify</div>
          <div>
            <a href="#" className="text-decoration-none me-3">Privacy</a>
            <a href="#" className="text-decoration-none">Terms</a>
          </div>
        </div>
      </footer>
    </>
  )
}
