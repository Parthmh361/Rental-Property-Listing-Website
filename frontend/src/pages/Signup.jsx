import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, User, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Signup() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/', { replace: true })
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="w-100" style={{ maxWidth: 450 }}>
        <div className="text-center mb-5">
          <div className="d-inline-block mb-3 p-3 rounded-circle" style={{ backgroundColor: 'var(--primary-light)' }}>
            <UserPlus size={32} className="text-primary" />
          </div>
          <h2 className="fw-700 mb-2">Create Account</h2>
          <p className="text-muted">Join Rentify and start browsing homes</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex gap-2 align-items-start" role="alert">
            <AlertCircle size={18} className="flex-shrink-0 mt-1" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={onSubmit} className="card p-4 shadow-md border-0">
          <div className="mb-4">
            <label className="form-label fw-600 mb-2">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0"><User size={18} className="text-secondary" /></span>
              <input
                className="form-control border-start-0"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-600 mb-2">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0"><Mail size={18} className="text-secondary" /></span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-600 mb-2">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0"><Lock size={18} className="text-secondary" /></span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <small className="text-muted d-block mt-1">Password must be at least 6 characters</small>
          </div>

          <button disabled={loading} className="btn btn-primary w-100 fw-600 py-2" type="submit">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small">Already have an account? <Link to="/login" className="fw-600">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}
