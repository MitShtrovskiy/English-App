// src/api.ts
import axios from 'axios'
import { Word } from './types'

export async function fetchWords(): Promise<Word[]> {
  const response = await axios.get('/api/words')
  return response.data
}