import React, { useEffect, useState } from 'react'
import api, { fileUrl } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home as HomeIcon, Bed, Bath, Star, ChevronLeft, ChevronRight, Edit2, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PropertyCard = ({ p, onRefresh }) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = (e) => {
    e.stopPropagation()
    navigate(`/properties/${p._id || p.id}/edit`)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/properties/${p._id || p.id}`)
      setShowDeleteModal(false)
      onRefresh()
    } catch (e) {
      console.error('Failed to delete property:', e)
      alert('Failed to delete property')
    } finally {
      setDeleting(false)
    }
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
        <small className="text-muted ms-1">({p.totalReviews} reviews)</small>
      </div>
    )
  }

  return (
    <div className="col">
      <div className="card h-100 shadow-sm overflow-hidden" style={{ cursor: 'pointer', border: '2px solid #0066cc', position: 'relative' }}>
        <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>
          <span className="badge bg-success d-flex align-items-center gap-1">
            <Star size={12} fill="white" /> Your Property
          </span>
        </div>
        <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
          <img src={fileUrl(p.imageUrl)} className="w-100 h-100" alt={p.title} style={{ objectFit: 'cover' }} />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary">₹{Number(p.price || 0).toLocaleString()}/mo</span>
          </div>
          <div className="position-absolute bottom-0 end-0 m-2 d-flex gap-2">
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
          
          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-sm fw-500 d-flex align-items-center justify-content-center gap-2" 
              onClick={(e) => { e.stopPropagation(); navigate(`/properties/${p._id || p.id}`); }}
            >
              View Details
            </button>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-warning btn-sm flex-grow-1 fw-500 d-flex align-items-center justify-content-center gap-2" 
                onClick={handleEdit}
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                className="btn btn-danger btn-sm flex-grow-1 fw-500 d-flex align-items-center justify-content-center gap-2" 
                onClick={handleDeleteClick}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{p.title}</strong>?</p>
                <p className="text-muted small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyProperties() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  const fetchMyProperties = async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/properties', {
        params: {
          createdBy: user?._id,
          page,
          limit: itemsPerPage
        }
      })
      const items = Array.isArray(data) ? data : (data?.items || [])
      setProperties(items)
      setCurrentPage(page)
      setTotalPages(data?.pages || 1)
    } catch (e) {
      setError('Failed to load your properties')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyProperties(1)
  }, [user, navigate])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchMyProperties(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchMyProperties(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleRefresh = () => {
    fetchMyProperties(currentPage)
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-5">
        <h2 className="fw-700 mb-2">My Listed Properties</h2>
        <p className="text-muted">Manage all properties you have listed on the platform</p>
      </div>

      {/* Error Alert */}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your properties...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-3">You haven't listed any properties yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/properties/new')}>
            List Your First Property
          </button>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
            {properties.map(p => <PropertyCard key={p._id || p.id} p={p} onRefresh={handleRefresh} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Page navigation" className="d-flex justify-content-center">
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
                      <button className="page-link" onClick={() => fetchMyProperties(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  )
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <li className="page-item disabled"><span className="page-link">...</span></li>
                    <li className="page-item">
                      <button className="page-link" onClick={() => fetchMyProperties(totalPages)}>
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
    </div>
  )
}
