import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Star, Trash2, AlertCircle } from 'lucide-react'

export default function ReviewSection({ propertyId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const [form, setForm] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [propertyId])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/reviews/property/${propertyId}`)
      setReviews(Array.isArray(data) ? data : [])
      setError('')
    } catch (e) {
      console.error('Failed to load reviews:', e)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to write a review')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await api.post('/reviews', {
        propertyId,
        rating: Number(form.rating),
        comment: form.comment
      })
      setForm({ rating: 5, comment: '' })
      await fetchReviews()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    setDeleting(reviewId)
    try {
      await api.delete(`/reviews/${reviewId}`)
      await fetchReviews()
    } catch (e) {
      alert('Failed to delete review')
    } finally {
      setDeleting(null)
    }
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`${star <= rating ? 'text-warning' : 'text-muted'} ${interactive ? 'cursor-pointer' : ''}`}
            fill={star <= rating ? '#FFC107' : 'none'}
            onClick={() => interactive && onChange && onChange(star)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="row mt-5">
      <div className="col-lg-8">
        {/* Write Review Section */}
        {user && (
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="fw-700 mb-3">Write a Review</h5>

              {error && (
                <div className="alert alert-danger d-flex gap-2 align-items-start mb-3" role="alert">
                  <AlertCircle size={20} className="flex-shrink-0 mt-1" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label className="form-label fw-600 mb-2">Rating</label>
                  <div>
                    {renderStars(Number(form.rating), true, (val) => setForm(f => ({ ...f, rating: val })))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-600 mb-2">Comment (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Share your experience with this property..."
                    value={form.comment}
                    onChange={(e) => setForm(f => ({ ...f, comment: e.target.value }))}
                    maxLength={500}
                  />
                  <small className="text-muted">{form.comment.length}/500 characters</small>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary fw-600"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}

        {!user && (
          <div className="alert alert-info mb-4">
            <strong>Please login</strong> to write a review for this property
          </div>
        )}

        {/* Reviews List Section */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="fw-700 mb-4">
              Reviews ({reviews.length})
            </h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-muted text-center py-4">No reviews yet. Be the first to review this property!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reviews.map((review) => (
                  <div key={review._id} className="border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-600 mb-1">{review.userName}</h6>
                        <p className="text-muted small mb-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {user && user._id === review.userId && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={deleting === review._id}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="mb-2">
                      {renderStars(review.rating)}
                    </div>

                    {review.comment && (
                      <p className="text-muted small mb-0">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
