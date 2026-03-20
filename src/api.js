// api.js — Smart API helper with localStorage fallback
// If the backend server is running, it uses the API
// If not, it falls back to localStorage so the app still works

const API_URL = 'http://localhost:5000/api'

// ============ AUTH HELPERS ============

export function saveAuth(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ============ API FETCH WITH FALLBACK ============

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

// Check if backend is available (cache result for the session)
let backendAvailable = null

async function isBackendUp() {
  if (backendAvailable !== null) return backendAvailable
  try {
    const response = await fetch(API_URL.replace('/api', '/'), { signal: AbortSignal.timeout(2000) })
    backendAvailable = response.ok
  } catch {
    backendAvailable = false
  }
  return backendAvailable
}

// ============ LOCAL STORAGE HELPERS ============

function getLocalData(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function setLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// ============ AUTH API ============

export const authAPI = {
  register: async (body) => {
    if (await isBackendUp()) {
      return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) })
    }
    // Fallback: save user to localStorage
    const users = getLocalData('local_users')
    const exists = users.find(u => u.email === body.email)
    if (exists) throw new Error('User with this email already exists')

    const user = {
      id: generateId(),
      fullName: body.fullName,
      email: body.email,
      role: body.role || 'patient'
    }
    users.push({ ...user, password: body.password })
    setLocalData('local_users', users)

    const token = 'local_' + generateId()
    saveAuth(token, user)
    return { token, user, message: 'Account created successfully' }
  },

  login: async (body) => {
    if (await isBackendUp()) {
      return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) })
    }
    // Fallback: check localStorage
    const users = getLocalData('local_users')
    const user = users.find(u => u.email === body.email && u.password === body.password)
    if (!user) throw new Error('Invalid email or password')

    const token = 'local_' + generateId()
    const userData = { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    saveAuth(token, userData)
    return { token, user: userData, message: 'Login successful' }
  },

  getMe: async () => {
    if (await isBackendUp()) return apiFetch('/auth/me')
    return getUser()
  }
}

// ============ MEDICINE API ============

export const medicineAPI = {
  getAll: async () => {
    if (await isBackendUp()) return apiFetch('/medicines')
    const user = getUser()
    if (!user) return []
    return getLocalData(`medicines_${user.id}`)
  },

  create: async (body) => {
    if (await isBackendUp()) {
      return apiFetch('/medicines', { method: 'POST', body: JSON.stringify(body) })
    }
    const user = getUser()
    const key = `medicines_${user.id}`
    const medicines = getLocalData(key)
    const newMed = { _id: generateId(), ...body, userId: user.id, createdAt: new Date().toISOString() }
    medicines.unshift(newMed)
    setLocalData(key, medicines)
    return newMed
  },

  update: async (id, body) => {
    if (await isBackendUp()) {
      return apiFetch(`/medicines/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    }
    const user = getUser()
    const key = `medicines_${user.id}`
    const medicines = getLocalData(key)
    const index = medicines.findIndex(m => m._id === id)
    if (index === -1) throw new Error('Medicine not found')
    medicines[index] = { ...medicines[index], ...body }
    setLocalData(key, medicines)
    return medicines[index]
  },

  remove: async (id) => {
    if (await isBackendUp()) {
      return apiFetch(`/medicines/${id}`, { method: 'DELETE' })
    }
    const user = getUser()
    const key = `medicines_${user.id}`
    const medicines = getLocalData(key).filter(m => m._id !== id)
    setLocalData(key, medicines)
    return { message: 'Medicine deleted' }
  }
}

// ============ APPOINTMENT API ============

export const appointmentAPI = {
  getAll: async () => {
    if (await isBackendUp()) return apiFetch('/appointments')
    const user = getUser()
    if (!user) return []
    return getLocalData(`appointments_${user.id}`)
  },

  create: async (body) => {
    if (await isBackendUp()) {
      return apiFetch('/appointments', { method: 'POST', body: JSON.stringify(body) })
    }
    const user = getUser()
    const key = `appointments_${user.id}`
    const appointments = getLocalData(key)
    const newApt = { _id: generateId(), ...body, userId: user.id, createdAt: new Date().toISOString() }
    appointments.unshift(newApt)
    setLocalData(key, appointments)
    return newApt
  },

  update: async (id, body) => {
    if (await isBackendUp()) {
      return apiFetch(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    }
    const user = getUser()
    const key = `appointments_${user.id}`
    const appointments = getLocalData(key)
    const index = appointments.findIndex(a => a._id === id)
    if (index === -1) throw new Error('Appointment not found')
    appointments[index] = { ...appointments[index], ...body }
    setLocalData(key, appointments)
    return appointments[index]
  },

  remove: async (id) => {
    if (await isBackendUp()) {
      return apiFetch(`/appointments/${id}`, { method: 'DELETE' })
    }
    const user = getUser()
    const key = `appointments_${user.id}`
    const appointments = getLocalData(key).filter(a => a._id !== id)
    setLocalData(key, appointments)
    return { message: 'Appointment deleted' }
  }
}
