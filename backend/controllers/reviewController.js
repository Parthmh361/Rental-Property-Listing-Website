const Property = require('../models/Property')
const Review = require('../models/Review')
const User = require('../models/User')

// POST /api/reviews - Create review (protected)
async function createReview(req, res) {
  try {
    const { propertyId, rating, comment } = req.body

    if (!propertyId || !rating) {
      return res.status(400).json({ message: 'Property ID and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Get user info
    const userId = req.userId
    const user = await User.findById(userId)
    const userName = user?.name || 'Anonymous'
    const userEmail = user?.email || 'anonymous@example.com'

    const review = await Review.create({
      propertyId,
      userId,
      rating,
      comment,
      userName,
      userEmail
    })

    // Update property average rating
    const allReviews = await Review.find({ propertyId })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: avgRating,
      totalReviews: allReviews.length
    })

    res.status(201).json(review)
  } catch (err) {
    console.error('createReview error:', err.message)
    res.status(400).json({ message: err.message })
  }
}

// GET /api/reviews/property/:propertyId - Get reviews for property
async function getPropertyReviews(req, res) {
  try {
    const { propertyId } = req.params
    const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    console.error('getPropertyReviews error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/reviews/:id - Delete review (protected)
async function deleteReview(req, res) {
  try {
    const { id } = req.params
    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user owns the review
    const userId = req.userId
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    await Review.findByIdAndDelete(id)

    // Update property average rating
    const allReviews = await Review.find({ propertyId: review.propertyId })
    if (allReviews.length === 0) {
      await Property.findByIdAndUpdate(review.propertyId, {
        averageRating: 0,
        totalReviews: 0
      })
    } else {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await Property.findByIdAndUpdate(review.propertyId, {
        averageRating: avgRating,
        totalReviews: allReviews.length
      })
    }

    res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    console.error('deleteReview error:', err.message)
    res.status(400).json({ message: err.message })
  }
}

module.exports = { createReview, getPropertyReviews, deleteReview }
