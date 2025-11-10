import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { fileUrl } from '../services/api'
import { MapPin, Bed, Bath, Home as HomeIcon, Loader, ArrowLeft, Eye, Star } from 'lucide-react'
import ReviewSection from '../components/ReviewSection'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewCounted, setViewCounted] = useState(false)
  const [showOwnerDetails, setShowOwnerDetails] = useState(false)
  const effectRun = useRef(false)

  useEffect(() => {
    // Prevent double execution in development (React Strict Mode)
    if (effectRun.current) return
    effectRun.current = true

    const run = async () => {
      setLoading(true)
      setError('')
      try {
        // Check if this property view has already been counted in this session
        const viewedProperties = JSON.parse(localStorage.getItem('viewedProperties') || '[]')
        const hasViewed = viewedProperties.includes(id)

        console.log(`[PropertyDetail] Loading property ${id}, already viewed: ${hasViewed}`)

        const { data } = await api.get(`/properties/${id}`)
        setP(data)

        // Only increment view if not already viewed in this session
        if (!hasViewed) {
          try {
            console.log(`[PropertyDetail] Incrementing view for property ${id}`)
            // Call separate endpoint to increment views
            await api.post(`/properties/${id}/increment-view`)
          } catch (e) {
            console.error('Failed to increment view:', e)
          }
          
          // Add to viewed properties list
          viewedProperties.push(id)
          localStorage.setItem('viewedProperties', JSON.stringify(viewedProperties))
          setViewCounted(true)
        }
      } catch (e) {
        setError('Property not found')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  if (loading) {
    return (
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div className="text-center">
          <Loader size={40} className="text-primary mb-3 animate-spin" />
          <p className="text-muted">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-primary mb-3 d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (!p) return null

  const images = [p.imageUrl, ...(p.gallery || [])].filter(Boolean).map(fileUrl)

  return (
    <div className="container-fluid p-0">
      <button className="btn btn-outline-primary m-3 d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            {images.length ? (
              <div id="carouselImages" className="carousel slide shadow-lg rounded-3" data-bs-ride="carousel">
                <div className="carousel-inner" style={{ borderRadius: 12 }}>
                  {images.map((src, idx) => (
                    <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                      <img src={src} className="d-block w-100" alt={`image-${idx}`} style={{ height: 500, objectFit: 'cover', borderRadius: 12 }} />
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselImages" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselImages" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center rounded-3 shadow-sm" style={{ height: 500 }}>
                <span className="text-muted">No images available</span>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target="#carouselImages"
                    data-bs-slide-to={idx}
                    className={`flex-shrink-0 border rounded-2 overflow-hidden ${idx === 0 ? 'border-primary' : ''}`}
                    style={{ width: 80, height: 80 }}
                    aria-label={`Slide ${idx + 1}`}
                  >
                    <img src={src} alt={`thumb-${idx}`} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-lg border-0 sticky-top" style={{ top: 100 }}>
              <div className="card-body">
                <h2 className="fw-700 mb-2">{p.title}</h2>
                <div className="d-flex align-items-center text-muted mb-3 small">
                  <MapPin size={16} className="me-1" /> {p.location}{p.city ? `, ${p.city}` : ''}{p.state ? `, ${p.state}` : ''}
                </div>

                <div className="mb-4">
                  <div className="h3 text-primary fw-700">₹{Number(p.price || 0).toLocaleString()}</div>
                  <small className="text-muted">per month</small>
                </div>

                {/* Owner Contact Details */}
                {p.ownerName || p.ownerPhone || p.ownerEmail ? (
                  <div className="mb-4">
                    {!showOwnerDetails ? (
                      <button
                        className="btn btn-outline-primary w-100 fw-600"
                        onClick={() => setShowOwnerDetails(true)}
                      >
                        👤 Get Owner Details
                      </button>
                    ) : (
                      <div className="bg-light p-3 rounded-3 border border-primary">
                        <h6 className="fw-700 mb-3">Owner Contact Details</h6>
                        {p.ownerName && (
                          <div className="mb-2">
                            <small className="text-muted">Name</small>
                            <div className="fw-600">{p.ownerName}</div>
                          </div>
                        )}
                        {p.ownerPhone && (
                          <div className="mb-2">
                            <small className="text-muted">Phone</small>
                            <div className="fw-600">
                              <a href={`tel:${p.ownerPhone}`} className="text-primary text-decoration-none">
                                {p.ownerPhone}
                              </a>
                            </div>
                          </div>
                        )}
                        {p.ownerEmail && (
                          <div className="mb-2">
                            <small className="text-muted">Email</small>
                            <div className="fw-600">
                              <a href={`mailto:${p.ownerEmail}`} className="text-primary text-decoration-none">
                                {p.ownerEmail}
                              </a>
                            </div>
                          </div>
                        )}
                        <button
                          className="btn btn-sm btn-outline-secondary w-100 mt-3"
                          onClick={() => setShowOwnerDetails(false)}
                        >
                          Hide Details
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="d-flex gap-3 mb-4">
                  <div className="p-3 bg-light rounded-2 text-center" style={{ flex: 1 }}>
                    <Bed size={20} className="text-primary mb-1" />
                    <div className="fw-600">{p.bedrooms}</div>
                    <small className="text-muted">Bedrooms</small>
                  </div>
                  <div className="p-3 bg-light rounded-2 text-center" style={{ flex: 1 }}>
                    <Bath size={20} className="text-primary mb-1" />
                    <div className="fw-600">{p.bathrooms}</div>
                    <small className="text-muted">Bathrooms</small>
                  </div>
                  <div className="p-3 bg-light rounded-2 text-center" style={{ flex: 1 }}>
                    <HomeIcon size={20} className="text-primary mb-1" />
                    <div className="fw-600">{p.sizeSqft}</div>
                    <small className="text-muted">Sqft</small>
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h6 className="fw-700 mb-3">Property Stats</h6>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <div className="p-2 bg-light rounded-2 text-center">
                        <Eye size={16} className="text-primary mb-1" />
                        <div className="fw-600">{p.views || 0}</div>
                        <small className="text-muted">Views</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-light rounded-2 text-center">
                        <Star size={16} className="text-warning mb-1" fill="#FFC107" />
                        <div className="fw-600">{p.averageRating ? p.averageRating.toFixed(1) : 'N/A'}</div>
                        <small className="text-muted">Rating</small>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h6 className="fw-700 mb-2">Details</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2"><strong>Type:</strong> {p.type}</li>
                    <li className="mb-2"><strong>Furnishing:</strong> {p.furnishing}</li>
                    {p.pincode && <li className="mb-2"><strong>PIN Code:</strong> {p.pincode}</li>}
                    {p.availableFrom && <li><strong>Available:</strong> {new Date(p.availableFrom).toLocaleDateString()}</li>}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="row mt-5">
          <div className="col-lg-8">
            {p.description && (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-700 mb-3">About this property</h5>
                  <p className="text-muted lh-lg">{p.description}</p>
                </div>
              </div>
            )}

            {Array.isArray(p.amenities) && p.amenities.length > 0 && (
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="fw-700 mb-3">Amenities</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {p.amenities.map((a, i) => (
                      <span key={i} className="badge bg-primary text-white fw-500 px-3 py-2">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection propertyId={id} />
      </div>
    </div>
  )
}

