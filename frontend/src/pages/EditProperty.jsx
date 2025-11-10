import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { fileUrl } from '../services/api'
import { Upload, AlertCircle, Check, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const types = ['Apartment', 'Villa', 'Studio', 'Independent House']
const furnishings = ['Furnished', 'Semi-Furnished', 'Unfurnished']

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: '',
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    amenities: ''
  })
  const [mainImage, setMainImage] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [mainImagePreview, setMainImagePreview] = useState(null)
  const [existingMainImage, setExistingMainImage] = useState(null)
  const [existingGallery, setExistingGallery] = useState([])

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`)
        
        // Check ownership
        if (data.createdBy !== user?._id) {
          setError('You do not have permission to edit this property')
          setTimeout(() => navigate('/my-properties'), 2000)
          return
        }

        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          location: data.location || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          sizeSqft: data.sizeSqft || '',
          type: data.type || 'Apartment',
          furnishing: data.furnishing || 'Semi-Furnished',
          amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : (data.amenities || '')
        })
        setExistingMainImage(data.imageUrl)
        setExistingGallery(data.gallery || [])
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProperty()
    }
  }, [id, user, navigate])

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onMainImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const onGalleryChange = (e) => setGalleryFiles(Array.from(e.target.files || []))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries({
        ...form,
        bedrooms: String(form.bedrooms),
        bathrooms: String(form.bathrooms),
        price: String(form.price),
        sizeSqft: String(form.sizeSqft)
      }).forEach(([k, v]) => fd.append(k, v))
      if (form.amenities) fd.set('amenities', form.amenities)
      if (mainImage) fd.append('mainImage', mainImage)
      if (galleryFiles?.length) galleryFiles.forEach((f) => fd.append('gallery', f))

      const { data } = await api.put(`/properties/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/properties/${data._id}`)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update property')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading property details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="mb-5">
        <h1 className="fw-700 mb-2">Edit Property</h1>
        <p className="text-muted">Update the details of your property</p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex gap-2 align-items-start" role="alert">
          <AlertCircle size={20} className="flex-shrink-0 mt-1" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={onSubmit} className="card shadow-lg border-0">
        <div className="card-body p-5">
          {/* Basic Info */}
          <h5 className="fw-700 mb-4">Basic Information</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-8">
              <label className="form-label fw-600 mb-2">Property Title</label>
              <input
                className="form-control"
                placeholder="e.g., Modern 2BHK Apartment"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Type</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                required
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-600 mb-2">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe your property..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Price (₹/month)</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Size (sq ft)</label>
              <input
                type="number"
                className="form-control"
                value={form.sizeSqft}
                onChange={(e) => update('sizeSqft', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <h5 className="fw-700 mb-4 mt-5">Location</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Location / Address</label>
              <input
                className="form-control"
                placeholder="e.g., Bandra, Mumbai"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">City</label>
              <input
                className="form-control"
                placeholder="e.g., Mumbai"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">State</label>
              <input
                className="form-control"
                placeholder="e.g., Maharashtra"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Pincode</label>
              <input
                className="form-control"
                placeholder="e.g., 400001"
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Property Features */}
          <h5 className="fw-700 mb-4 mt-5">Property Features</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Furnishing</label>
              <select
                className="form-select"
                value={form.furnishing}
                onChange={(e) => update('furnishing', e.target.value)}
                required
              >
                {furnishings.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-600 mb-2">Amenities</label>
              <input
                className="form-control"
                placeholder="e.g., Parking, Gym, Swimming Pool (comma-separated)"
                value={form.amenities}
                onChange={(e) => update('amenities', e.target.value)}
              />
            </div>
          </div>

          {/* Images */}
          <h5 className="fw-700 mb-4 mt-5">Property Images</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Main Image</label>
              <div className="border-2 rounded-3 p-4 text-center bg-light" style={{ borderStyle: 'dashed' }}>
                <input
                  type="file"
                  accept="image/*"
                  className="d-none"
                  id="mainImageInput"
                  onChange={onMainImageChange}
                />
                <label htmlFor="mainImageInput" className="d-flex flex-column align-items-center gap-2" style={{ cursor: 'pointer' }}>
                  <Upload size={24} className="text-primary" />
                  <span className="fw-600 text-primary">Upload Main Image</span>
                  {mainImage && <span className="small text-success d-flex align-items-center gap-1"><Check size={14} /> {mainImage.name}</span>}
                </label>
              </div>
              {mainImagePreview && (
                <div className="mt-3">
                  <p className="small fw-600 mb-2">New Preview:</p>
                  <img src={mainImagePreview} alt="preview" className="img-fluid rounded-2" style={{ maxHeight: 200 }} />
                </div>
              )}
              {existingMainImage && !mainImagePreview && (
                <div className="mt-3">
                  <p className="small fw-600 mb-2">Current Image:</p>
                  <img src={fileUrl(existingMainImage)} alt="current" className="img-fluid rounded-2" style={{ maxHeight: 200 }} />
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Gallery Images</label>
              <div className="border-2 rounded-3 p-4 text-center bg-light" style={{ borderStyle: 'dashed' }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  id="galleryInput"
                  onChange={onGalleryChange}
                />
                <label htmlFor="galleryInput" className="d-flex flex-column align-items-center gap-2" style={{ cursor: 'pointer' }}>
                  <Upload size={24} className="text-primary" />
                  <span className="fw-600 text-primary">Upload Gallery Images</span>
                  {galleryFiles.length > 0 && (
                    <span className="small text-success d-flex align-items-center gap-1">
                      <Check size={14} /> {galleryFiles.length} file(s) selected
                    </span>
                  )}
                </label>
              </div>
              {existingGallery.length > 0 && galleryFiles.length === 0 && (
                <div className="mt-3">
                  <p className="small fw-600 mb-2">Current Gallery ({existingGallery.length} images):</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {existingGallery.map((img, idx) => (
                      <img key={idx} src={fileUrl(img)} alt="gallery" className="rounded-2" style={{ maxHeight: 80, maxWidth: 80, objectFit: 'cover' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-footer bg-light p-4 d-flex gap-3 justify-content-end">
          <button type="button" className="btn btn-outline-secondary fw-600 px-4" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button disabled={submitting} className="btn btn-primary fw-600 px-5 d-flex align-items-center gap-2" type="submit">
            {submitting ? (
              <>
                <Loader size={18} className="spinner-border spinner-border-sm" />
                Updating...
              </>
            ) : (
              <>
                <Check size={18} /> Update Property
              </>
            )}
          </button>
        </div>
      </form>

      <div className="alert alert-info mt-4">
        <strong>Tip:</strong> Update high-quality images of your property. Properties with good photos get more inquiries!
      </div>
    </div>
  )
}
