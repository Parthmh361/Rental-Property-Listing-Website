import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Upload, AlertCircle, Check } from 'lucide-react'

const types = ['Apartment', 'Villa', 'Studio', 'Independent House']
const furnishings = ['Furnished', 'Semi-Furnished', 'Unfurnished']

// Comprehensive State and City mapping for India
const statesAndCities = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Nellore', 'Rajahmundry'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezu'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon', 'Barpeta'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Madhubani', 'Munger', 'Darbhanga'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Durg', 'Rajnandgaon', 'Bilaspur'],
  'Delhi': ['New Delhi', 'Delhi Cantonment', 'East Delhi', 'West Delhi', 'South Delhi', 'North Delhi', 'Central Delhi'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'North Goa', 'South Goa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Bhavnagar', 'Anand', 'Kheda'],
  'Haryana': ['Gurugram', 'Faridabad', 'Hisar', 'Rohtak', 'Karnal', 'Panipat', 'Ambala', 'Yamunanagar'],
  'Himachal Pradesh': ['Shimla', 'Solan', 'Mandi', 'Kangra', 'Kullu', 'Chamba'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Giridih', 'Bokaro', 'Hazaribag'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore', 'Hubballi', 'Gulbarga', 'Davangere', 'Belgaum', 'Shimoga', 'Udupi'],
  'Kerala': ['Kochi', 'Thrissur', 'Kozhikode', 'Kannur', 'Kottayam', 'Pathanamthitta', 'Alappuzha'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Satna', 'Ratlam'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Ratnagiri'],
  'Manipur': ['Imphal', 'Ukhrul', 'Bishnupur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha'],
  'Nagaland': ['Kohima', 'Dimapur', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Balasore'],
  'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Moga', 'Bathinda'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner', 'Kota', 'Bhilwara', 'Alwar', 'Sikar'],
  'Sikkim': ['Gangtok', 'Pelling', 'Namchi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruppur', 'Thanjavur', 'Trichy', 'Erode', 'Kanyakumari'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Ramagundam'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Mathura'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Rishikesh', 'Mussoorie'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Asansol', 'Siliguri', 'Durgapur', 'Howrah', 'Kharagpur', 'Jalpaiguri']
}

export default function NewProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
    amenities: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: ''
  })
  const [mainImage, setMainImage] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [mainImagePreview, setMainImagePreview] = useState(null)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Get available cities for selected state
  const availableCities = useMemo(() => {
    return statesAndCities[form.state] || []
  }, [form.state])

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
    setLoading(true)
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

      const { data } = await api.post('/properties', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/properties/${data._id}`)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="mb-5">
        <h1 className="fw-700 mb-2">List Your Property</h1>
        <p className="text-muted">Fill in the details below to get your property listed on Rentify</p>
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
              <label className="form-label fw-600 mb-2">Monthly Rent (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="18000"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-600 mb-2">Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Describe your property in detail..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <h5 className="fw-700 mb-4">Location</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Address</label>
              <input
                className="form-control"
                placeholder="Street address"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-600 mb-2">State</label>
              <select
                className="form-select"
                value={form.state}
                onChange={(e) => {
                  update('state', e.target.value)
                  update('city', '')
                }}
                required
              >
                <option value="">Select State</option>
                {Object.keys(statesAndCities).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-600 mb-2">City</label>
              <select
                className="form-select"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                required
                disabled={!form.state}
              >
                <option value="">Select City</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-600 mb-2">PIN</label>
              <input
                className="form-control"
                placeholder="400050"
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Features */}
          <h5 className="fw-700 mb-4">Features</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-3">
              <label className="form-label fw-600 mb-2">Bedrooms</label>
              <input
                type="number"
                className="form-control"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                min={0}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-600 mb-2">Bathrooms</label>
              <input
                type="number"
                className="form-control"
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
                min={0}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-600 mb-2">Size (sqft)</label>
              <input
                type="number"
                className="form-control"
                placeholder="950"
                value={form.sizeSqft}
                onChange={(e) => update('sizeSqft', e.target.value)}
                min={0}
              />
            </div>
          </div>

          {/* Type & Furnishing */}
          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Property Type</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Furnishing</label>
              <select
                className="form-select"
                value={form.furnishing}
                onChange={(e) => update('furnishing', e.target.value)}
              >
                {furnishings.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Amenities</label>
              <input
                className="form-control"
                placeholder="Lift, Parking, Gym"
                value={form.amenities}
                onChange={(e) => update('amenities', e.target.value)}
              />
            </div>
          </div>

          {/* Contact Details */}
          <h5 className="fw-700 mb-4">Owner Contact Details</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Owner Name</label>
              <input
                className="form-control"
                placeholder="e.g., Raj Kumar"
                value={form.ownerName}
                onChange={(e) => update('ownerName', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Phone Number</label>
              <input
                className="form-control"
                placeholder="e.g., 9876543210"
                value={form.ownerPhone}
                onChange={(e) => update('ownerPhone', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-600 mb-2">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g., owner@example.com"
                value={form.ownerEmail}
                onChange={(e) => update('ownerEmail', e.target.value)}
              />
            </div>
          </div>

          {/* Images */}
          <h5 className="fw-700 mb-4">Images</h5>
          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <label className="form-label fw-600 mb-2">Primary Image</label>
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
                  <img src={mainImagePreview} alt="preview" className="img-fluid rounded-2" style={{ maxHeight: 200 }} />
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
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-footer bg-light p-4 d-flex gap-3 justify-content-end">
          <button type="button" className="btn btn-outline-secondary fw-600 px-4" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button disabled={loading} className="btn btn-primary fw-600 px-5 d-flex align-items-center gap-2" type="submit">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Publishing...
              </>
            ) : (
              <>
                <Check size={18} /> Publish Listing
              </>
            )}
          </button>
        </div>
      </form>

      <div className="alert alert-info mt-4">
        <strong>Tip:</strong> Upload high-quality images of your property. Properties with good photos get more inquiries!
      </div>
    </div>
  )
}
