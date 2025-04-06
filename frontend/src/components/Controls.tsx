// src/components/Controls.tsx

import { Button } from '@/components/ui/button'
import { EyeOff, Volume2, RefreshCcw, Check } from 'lucide-react'

interface ControlsProps {
  onToggleTranslation: () => void
  onSpeak: () => void
  onToggleLanguage: () => void
  onMarkAsLearned: () => void
}

export default function Controls({
  onToggleTranslation,
  onSpeak,
  onToggleLanguage,
  onMarkAsLearned,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap pt-6">
      <Button onClick={onToggleTranslation} variant="ghost" size="lg" className="w-12 h-12">
        <EyeOff className="w-6 h-6" />
      </Button>
      <Button onClick={onSpeak} variant="ghost" size="lg" className="w-12 h-12">
        <Volume2 className="w-6 h-6" />
      </Button>
      <Button onClick={onToggleLanguage} variant="ghost" size="lg" className="w-12 h-12">
        <RefreshCcw className="w-6 h-6" />
      </Button>
      <Button onClick={onMarkAsLearned} variant="outline" className="ml-auto text-sm px-4 py-3 rounded-xl">
        <Check className="w-4 h-4 mr-2" />
        Выучил
      </Button>
    </div>
  )
}