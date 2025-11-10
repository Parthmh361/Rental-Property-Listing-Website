import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="w-100" style={{ maxWidth: 450 }}>
        <div className="text-center mb-5">
          <div className="d-inline-block mb-3 p-3 rounded-circle bg-primary-light">
            <LogIn size={32} className="text-primary" />
          </div>
          <h2 className="fw-700 mb-2">Welcome Back</h2>
          <p className="text-muted">Login to your Rentify account</p>
          
          {/* Context Message */}
          {location.state?.from?.pathname === '/properties/new' && (
            <div className="alert alert-info mt-4 mb-4 text-start" role="alert">
              <p className="mb-0">
                <strong>Sign in to list your property or browse rental opportunities</strong>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger d-flex gap-2 align-items-start" role="alert">
            <AlertCircle size={18} className="flex-shrink-0 mt-1" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={onSubmit} className="card p-4 shadow-md border-0">
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
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button disabled={loading} className="btn btn-primary w-100 fw-600 py-2" type="submit">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small">Don't have an account? <Link to="/signup" className="fw-600">Sign up here</Link></p>
        </div>
      </div>
    </div>
  )
}
