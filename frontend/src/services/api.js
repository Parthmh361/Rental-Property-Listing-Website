import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_ORIGIN = baseURL.replace(/\/api$/, '')

const api = axios.create({
  baseURL,
  withCredentials: false
})

export default api

export function fileUrl(p) {
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  // assume server-relative like /uploads/...
  return `${API_ORIGIN}${p}`
}
