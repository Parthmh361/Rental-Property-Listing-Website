const Property = require('../models/Property')

// GET /api/properties
// Public - with filters & pagination
async function getProperties(req, res) {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      beds,
      city,
      type,
      createdBy,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query

    const filter = {}

    if (q) {
      const regex = new RegExp(q, 'i')
      filter.$or = [
        { title: regex },
        { location: regex },
        { description: regex },
        { city: regex },
        { state: regex }
      ]
    }

    if (createdBy) filter.createdBy = createdBy
    if (city) filter.city = new RegExp(`^${city}$`, 'i')
    if (type) filter.type = type
    if (beds) filter.bedrooms = { $gte: Number(beds) }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [items, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Property.countDocuments(filter)
    ])

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    })
  } catch (err) {
    console.error('getProperties error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/properties/:id
async function getPropertyById(req, res) {
  try {
    const p = await Property.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Property not found' })
    res.json(p)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/properties/:id/increment-view - Increment view count
async function incrementPropertyView(req, res) {
  try {
    console.log(`[incrementPropertyView] Incrementing view for property ${req.params.id}`)
    const p = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!p) return res.status(404).json({ message: 'Property not found' })
    console.log(`[incrementPropertyView] New view count: ${p.views}`)
    res.json({ views: p.views })
  } catch (err) {
    console.error('[incrementPropertyView] Error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/properties (protected)
async function createProperty(req, res) {
  try {
    const data = { ...req.body }
    // Normalize types coming as strings from forms
    ;['price', 'bedrooms', 'bathrooms', 'sizeSqft'].forEach((k) => {
      if (data[k] !== undefined) data[k] = Number(data[k])
    })
    // Normalize amenities and gallery (support comma-separated string or array)
    if (typeof data.amenities === 'string') {
      data.amenities = data.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof data.gallery === 'string') {
      data.gallery = data.gallery
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (!Array.isArray(data.gallery)) data.gallery = data.gallery ? [data.gallery] : []

    // Map uploaded files to imageUrl and gallery paths
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      const f = req.files.mainImage[0]
      data.imageUrl = `/uploads/${f.filename}`
    }
    if (req.files && req.files.gallery && req.files.gallery.length) {
      data.gallery = req.files.gallery.map((f) => `/uploads/${f.filename}`)
    }

    if (req.userId) data.createdBy = req.userId
    const created = await Property.create(data)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT /api/properties/:id (protected - update property)
async function updateProperty(req, res) {
  try {
    const { id } = req.params
    const property = await Property.findById(id)
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' })
    }

    const data = { ...req.body }
    // Normalize numeric fields
    ;['price', 'bedrooms', 'bathrooms', 'sizeSqft'].forEach((k) => {
      if (data[k] !== undefined) data[k] = Number(data[k])
    })
    
    // Normalize amenities
    if (typeof data.amenities === 'string') {
      data.amenities = data.amenities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    // Handle file uploads
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      const f = req.files.mainImage[0]
      data.imageUrl = `/uploads/${f.filename}`
    }
    if (req.files && req.files.gallery && req.files.gallery.length) {
      data.gallery = req.files.gallery.map((f) => `/uploads/${f.filename}`)
    }

    const updated = await Property.findByIdAndUpdate(id, data, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/properties/:id (protected - delete property)
async function deleteProperty(req, res) {
  try {
    const { id } = req.params
    const property = await Property.findById(id)
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check if user owns the property
    if (property.createdBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' })
    }

    await Property.findByIdAndDelete(id)
    res.json({ message: 'Property deleted successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// GET /api/properties/cities (public - get all unique cities)
async function getCities(req, res) {
  try {
    const cities = await Property.distinct('city')
    const sortedCities = cities.sort()
    res.json(sortedCities)
  } catch (err) {
    console.error('getCities error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getProperties, getPropertyById, incrementPropertyView, createProperty, updateProperty, deleteProperty, getCities }
