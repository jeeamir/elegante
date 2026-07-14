import axios from 'axios'

const api = axios.create({ baseURL: '/' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const authAPI = {
  register: (email, password) =>
    api.post('/auth/register', { email, password }),
  login: (email, password) => {
    const form = new FormData()
    form.append('username', email)
    form.append('password', password)
    return api.post('/auth/login', form)
  },
}

export const profileAPI = {
  create: (data) => api.post('/profile/', data),
}

export const outfitsAPI = {
  generate: (occasion, mood) => api.post('/outfits/', { occasion, mood }),
  history: () => api.get('/outfits/history'),
  photoFeedback: (file, occasion) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/outfits/photo-feedback?occasion=${encodeURIComponent(occasion)}`, form)
  },
}

export const wardrobeAPI = {
  analyzePhoto: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/wardrobe/analyze-photo', form)
  },
}

export default api
