import React, { useEffect, useState } from 'react'

const heroImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2UlMjBleHRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=600&fit=crop'
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="position-relative text-white overflow-hidden"
      style={{
        height: '500px',
        background: `url('${heroImages[currentImageIndex]}') center/cover no-repeat`,
        backgroundAttachment: 'fixed',
        transition: 'background-image 1.2s ease-in-out'
      }}
    >
      {/* Dark Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 102, 204, 0.3) 100%)',
          zIndex: 1
        }}
      ></div>

      {/* Content */}
      <div
        className="position-absolute top-50 start-50 translate-middle text-center w-100"
        style={{ zIndex: 2 }}
      >
        <div
          className="animate__animated animate__fadeInUp"
          style={{
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          <h1 className="display-5 fw-700 mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Find Your Dream Home
          </h1>
          <p className="fs-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Browse premium rental properties in your favorite cities
          </p>
        </div>
      </div>

      {/* Image Indicators */}
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 pb-4"
        style={{ zIndex: 3 }}
      >
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            className="rounded-pill border-0"
            style={{
              width: idx === currentImageIndex ? '32px' : '10px',
              height: '10px',
              background: idx === currentImageIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.4s ease'
            }}
            onClick={() => setCurrentImageIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="position-absolute top-50 start-0 translate-middle-y btn btn-light d-none d-lg-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: '50px',
          height: '50px',
          zIndex: 3,
          margin: '0 20px',
          opacity: 0.8,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.8')}
        onClick={() =>
          setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
        }
        aria-label="Previous image"
      >
        ❮
      </button>
      <button
        className="position-absolute top-50 end-0 translate-middle-y btn btn-light d-none d-lg-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: '50px',
          height: '50px',
          zIndex: 3,
          margin: '0 20px',
          opacity: 0.8,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.8')}
        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
        aria-label="Next image"
      >
        ❯
      </button>
    </div>
  )
}
