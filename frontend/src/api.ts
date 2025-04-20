import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Подставляем токен при старте
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getWords = async () => {
  const response = await api.get('/words')
  return response.data
}

export const getWord = async (id: number) => {
  const response = await api.get(`/words/${id}`)
  return response.data
}

export const addWord = async (wordData: {
  word: string
  translation: string
  transcription?: string
  example?: string
}) => {
  const response = await api.post('/words', wordData)
  return response.data
}

export const updateWord = async (
  id: number,
  updatedData: {
    word?: string
    translation?: string
    transcription?: string
    example?: string
    isLearned?: boolean
  }
) => {
  const response = await api.put(`/words/${id}`, updatedData)
  return response.data
}

export const deleteWord = async (id: number) => {
  const response = await api.delete(`/words/${id}`)
  return response.data
}

export { api }