import axios from 'axios'
import { Word } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url/api'

/**
 * Получить список всех слов
 */
export const getWords = async (): Promise<Word[]> => {
  const response = await axios.get(`${API_BASE_URL}/words`)
  return response.data
}

/**
 * Добавить новое слово
 */
export const addWord = async (word: Word): Promise<Word> => {
  const response = await axios.post(`${API_BASE_URL}/words`, word)
  return response.data
}

/**
 * Пометить слово как выученное
 */
export const markAsLearned = async (id: number): Promise<void> => {
  await axios.post(`${API_BASE_URL}/words/${id}/learned`)
}

/**
 * Удалить слово
 */
export const deleteWord = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/words/${id}`)
}