import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { api } from '@/utils/api'

interface Word {
  id: number
  word: string
  translation: string
  learned: boolean
}

