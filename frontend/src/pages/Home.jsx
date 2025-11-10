import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import { useAuth } from '../context/AuthContext'
import { Search, BookOpen, PlusCircle, LogIn } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Section - Why Choose Rentify */}
      <div className="container py-5" style={{ borderBottom: '1px solid #e9ecef' }}>
        <h3 className="fw-700 text-center mb-5">Why Choose Rentify?</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <video 
                style={{ height: '200px', width: '100%', objectFit: 'cover', backgroundColor: '#000' }}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="videos/video_1_card.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-body text-center">
                <h5 className="fw-600 mb-2">Wide Selection</h5>
                <p className="text-muted small">Browse thousands of properties across major cities</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <video 
                style={{ height: '200px', width: '100%', objectFit: 'cover', backgroundColor: '#000' }}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="videos/video_2_card.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-body text-center">
                <h5 className="fw-600 mb-2">Smart Filters</h5>
                <p className="text-muted small">Find properties matching your budget and preferences</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <video 
                style={{ height: '200px', width: '100%', objectFit: 'cover', backgroundColor: '#000' }}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="videos/video_3_card.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="card-body text-center">
                <h5 className="fw-600 mb-2">Easy Listing</h5>
                <p className="text-muted small">List your property in minutes with our simple process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Welcome Section */}
        {user && (
          <div className="mb-5">
            <h2 className="fw-700 mb-2">Welcome back, {user.name}!</h2>
            <p className="text-muted">Manage your properties and explore rental opportunities</p>
          </div>
        )}

        {/* Action Cards Grid */}
        <div className="row g-4 mt-3">
          {/* Browse Properties Card */}
          <div className="col-md-6 col-lg-4">
            <div 
              className="card h-100 shadow-sm border-0" 
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,204,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate('/browse')}
            >
              <div className="card-body text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem' }}>
                  <Search size={48} className="text-primary" />
                </div>
                <h4 className="card-title fw-700 mb-2">Browse Properties</h4>
                <p className="card-text text-muted mb-4">
                  Search and explore all available rental properties with advanced filters
                </p>
                <button className="btn btn-primary fw-600 px-4">
                  Start Browsing
                </button>
              </div>
            </div>
          </div>

          {/* My Properties Card */}
          {user ? (
            <div className="col-md-6 col-lg-4">
              <div 
                className="card h-100 shadow-sm border-0" 
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,204,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onClick={() => navigate('/my-properties')}
              >
                <div className="card-body text-center py-5">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>
                    <BookOpen size={48} className="text-success" />
                  </div>
                  <h4 className="card-title fw-700 mb-2">My Properties</h4>
                  <p className="card-text text-muted mb-4">
                    Manage and view all properties you have listed on the platform
                  </p>
                  <button className="btn btn-success fw-600 px-4">
                    View My Properties
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* List Property Card */}
          <div className="col-md-6 col-lg-4">
            <div 
              className="card h-100 shadow-sm border-0" 
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                backgroundColor: '#f8f9fa'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,204,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onClick={() => user ? navigate('/properties/new') : navigate('/login', { state: { from: { pathname: '/properties/new' } } })}
            >
              <div className="card-body text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem' }}>
                  {user ? (
                    <PlusCircle size={48} className="text-warning" />
                  ) : (
                    <LogIn size={48} className="text-info" />
                  )}
                </div>
                <h4 className="card-title fw-700 mb-2">
                  {user ? 'List a Property' : 'Get Started'}
                </h4>
                <p className="card-text text-muted mb-4">
                  {user 
                    ? 'Add your property to reach thousands of potential tenants'
                    : 'Sign in to list your property or browse rental opportunities'
                  }
                </p>
                <button className={`btn ${user ? 'btn-warning' : 'btn-info'} fw-600 px-4`}>
                  {user ? 'List Now' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
