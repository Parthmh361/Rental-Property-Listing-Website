const express = require('express')
const { getProperties, getPropertyById, incrementPropertyView, createProperty, updateProperty, deleteProperty, getCities } = require('../controllers/propertyController')
const { protect } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/uploadMiddleware')

const router = express.Router()

// Non-parameterized routes (must come first)
router.get('/', getProperties)
router.get('/cities', getCities)

// Generic :id routes - POST for new property
router.post('/', protect, upload.fields([
	{ name: 'mainImage', maxCount: 1 },
	{ name: 'gallery', maxCount: 10 }
]), createProperty)

// Routes with :id parameter (must be after non-param routes)
// Specific increment-view route
router.post('/:id/increment-view', incrementPropertyView)

// PUT and DELETE for specific ID
router.put('/:id', protect, upload.fields([
	{ name: 'mainImage', maxCount: 1 },
	{ name: 'gallery', maxCount: 10 }
]), updateProperty)
router.delete('/:id', protect, deleteProperty)

// GET by ID (must be last to not interfere with other :id routes)
router.get('/:id', getPropertyById)

module.exports = router
