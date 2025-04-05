// frontend/src/utils/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://english-app-backend-mvbg.onrender.com', // 👈 это и есть твой backend
})