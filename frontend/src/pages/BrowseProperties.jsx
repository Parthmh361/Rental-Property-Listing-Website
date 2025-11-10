import React, { useEffect, useState } from 'react'
import api, { fileUrl } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home as HomeIcon, Bed, Bath, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PropertyCard = ({ p, isOwnProperty, user, onViewDetails }) => {
  const navigate = useNavigate()

  const handleViewDetails = (e) => {
    e.stopPropagation()
    if (!user) {
      onViewDetails()
      return
    }
    navigate(`/properties/${p._id || p.id}`)
  }

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= Math.floor(rating) ? 'text-warning' : 'text-muted'}
            fill={star <= Math.floor(rating) ? '#FFC107' : 'none'}
          />
        ))}
        <small className="text-muted ms-1">({p.totalReviews || 0})</small>
      </div>
    )
  }

  return (
    <div className="col">
      <div className="card h-100 shadow-sm overflow-hidden" style={{ cursor: 'pointer', position: 'relative', border: isOwnProperty ? '2px solid #0066cc' : 'none' }}>
        {isOwnProperty && user && (
          <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>
            <span className="badge bg-success d-flex align-items-center gap-1">
              <Star size={12} fill="white" /> Your Property
            </span>
          </div>
        )}
        <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
          <img src={fileUrl(p.imageUrl)} className="w-100 h-100" alt={p.title} style={{ objectFit: 'cover' }} />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary">₹{Number(p.price || 0).toLocaleString()}/mo</span>
          </div>
          <div className="position-absolute bottom-0 end-0 m-2">
            <span className="badge bg-dark d-flex align-items-center gap-1">
              <Eye size={12} /> {p.views || 0}
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-600 mb-1">{p.title}</h5>
          <div className="d-flex align-items-center text-muted small mb-2">
            <MapPin size={14} className="me-1" /> {p.location}
          </div>
          
          {/* Rating */}
          <div className="mb-2">
            {renderStars(p.averageRating || 0)}
          </div>
          
          <div className="d-flex gap-3 small text-secondary mb-3">
            <span className="d-flex align-items-center gap-1"><Bed size={14} /> {p.bedrooms} BR</span>
            <span className="d-flex align-items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
            <span className="d-flex align-items-center gap-1"><HomeIcon size={14} /> {p.sizeSqft} sqft</span>
          </div>
          <p className="card-text text-muted small flex-grow-1">{p.description}</p>
          <button className="btn btn-primary w-100 fw-500" onClick={handleViewDetails}>View Details</button>
        </div>
      </div>
    </div>
  )
}

export default function BrowseProperties() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    city: '',
    type: ''
  })

  const handleViewDetailsLoggedOut = () => {
    setShowToast(true)
    setTimeout(() => {
      navigate('/signup')
    }, 2000)
  }

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/properties/cities')
      setCities(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to load cities:', e.message)
    }
  }

  const fetchData = async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const params = { ...filters, page, limit: 12 }
      if (query) params.q = query
      const { data } = await api.get('/properties', { params })
      const items = Array.isArray(data) ? data : (data?.items || [])
      setList(items)
      setCurrentPage(page)
      setTotalPages(data?.pages || 1)
    } catch (e) {
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()
    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchData(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setCurrentPage(1)
    fetchData(1)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setQuery('')
    setFilters({
      minPrice: '',
      maxPrice: '',
      beds: '',
      city: '',
      type: ''
    })
    setCurrentPage(1)
  }

  const resetFilters = () => {
    clearFilters()
    setTimeout(() => fetchData(1), 0)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchData(currentPage + 1)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Search Bar */}
      <div className="container mt-5 mb-5">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            {/* Search Row */}
            <div className="row g-2 mb-4">
              <div className="col-lg-8">
                <label className="form-label small fw-600 mb-2">Search</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">🔍</span>
                  <input
                    className="form-control border-start-0"
                    placeholder="Search by location or title..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100 fw-600">Search</button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="row g-3 align-items-end">
              <div className="col-md-6 col-lg-2">
                <label className="form-label small fw-600 mb-2">Min Price</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0">₹</span>
                  <input
                    type="number"
                    className="form-control border-start-0"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-2">
                <label className="form-label small fw-600 mb-2">Max Price</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0">₹</span>
                  <input
                    type="number"
                    className="form-control border-start-0"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-2">
                <label className="form-label small fw-600 mb-2">Bedrooms</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.beds}
                  onChange={(e) => handleFilterChange('beds', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div className="col-md-6 col-lg-2">
                <label className="form-label small fw-600 mb-2">City</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 col-lg-2">
                <label className="form-label small fw-600 mb-2">Type</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Independent House">House</option>
                </select>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="row g-2 mt-2">
              <div className="col-md-6 col-lg-2">
                <button
                  type="button"
                  className="btn btn-primary w-100 fw-600"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
              <div className="col-md-6 col-lg-2">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 fw-600"
                  onClick={resetFilters}
                >
                  Clear All
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container py-4">
        <div className="mb-4">
          <h3 className="fw-700 mb-1">Browse All Properties</h3>
          <p className="text-muted small">Explore rental properties across all cities</p>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading properties...</p>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No properties found. Try adjusting your search.</p>
          </div>
        )}
        {!loading && list.length > 0 && (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
              {list.map(p => <PropertyCard key={p._id || p.id} p={p} isOwnProperty={user?._id === p.createdBy} user={user} onViewDetails={handleViewDetailsLoggedOut} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation" className="d-flex justify-content-center mb-4">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link d-flex align-items-center gap-2" onClick={handlePrevPage} disabled={currentPage === 1}>
                      <ChevronLeft size={16} /> Previous
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => fetchData(pageNum)}>
                          {pageNum}
                        </button>
                      </li>
                    )
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <li className="page-item disabled"><span className="page-link">...</span></li>
                      <li className="page-item">
                        <button className="page-link" onClick={() => fetchData(totalPages)}>
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link d-flex align-items-center gap-2" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      Next <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* Page Info */}
            <div className="text-center text-muted small">
              <p>Page {currentPage} of {totalPages}</p>
            </div>
          </>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 11, marginTop: '20px' }}>
            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header bg-info text-white border-0">
                <strong className="me-auto">Please Login</strong>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowToast(false)}></button>
              </div>
              <div className="toast-body">
                Please sign up or login first to view property details.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
