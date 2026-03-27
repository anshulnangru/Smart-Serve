import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartserve_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Services
export const fetchServices = (params = {}) => client.get('/services', { params })
export const fetchService = (id) => client.get(`/services/${id}`)
export const fetchCategories = () => client.get('/categories')
export const fetchTimeSlots = () => client.get('/time-slots')
export const fetchCities = () => client.get('/cities')

// Reviews
export const fetchReviews = (serviceId) => client.get(`/reviews/${serviceId}`)

// Auth
export const registerUser = (data) => client.post('/auth/register', data)
export const loginUser = (data) => client.post('/auth/login', data)
export const fetchMe = () => client.get('/auth/me')
export const updateProfile = (data) => client.patch('/auth/profile', data)

// Bookings
export const createBooking = (data) => client.post('/bookings', data)
export const fetchBookings = () => client.get('/bookings')
export const cancelBooking = (id) => client.patch(`/bookings/${id}/cancel`)

export default client
