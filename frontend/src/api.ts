// src/api.ts

import axios from 'axios'

// ✅ Получаем базовый адрес из .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// ✅ Создаём инстанс axios с базовым URL
const api = axios.create({
  baseURL: API_BASE_URL,
})

// ✅ Получение всех слов
export const getWords = async () => {
  const response = await api.get('/words')
  return response.data
}

// ✅ Получение одного слова по ID
export const getWord = async (id: number) => {
  const response = await api.get(`/words/${id}`)
  return response.data
}

// ✅ Добавление нового слова
export const addWord = async (wordData: {
  word: string
  translation: string
  transcription?: string
  example?: string
}) => {
  const response = await api.post('/words', wordData)
  return response.data
}

// ✅ Обновление существующего слова
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

// ✅ Удаление слова
export const deleteWord = async (id: number) => {
  const response = await api.delete(`/words/${id}`)
  return response.data
}