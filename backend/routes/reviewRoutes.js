const express = require('express')
const { createReview, getPropertyReviews, deleteReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createReview)
router.get('/property/:propertyId', getPropertyReviews)
router.delete('/:id', protect, deleteReview)

module.exports = router
