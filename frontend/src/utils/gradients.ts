export const gradients = [
  'bg-gradient-to-tr from-pink-500 to-yellow-500',
  'bg-gradient-to-tr from-blue-500 to-purple-600',
  'bg-gradient-to-tr from-green-400 to-lime-600',
  'bg-gradient-to-tr from-cyan-500 to-teal-400',
  'bg-gradient-to-tr from-rose-400 to-fuchsia-500',
  'bg-gradient-to-tr from-indigo-500 to-sky-400',
  'bg-gradient-to-tr from-orange-400 to-red-500',
  'bg-gradient-to-tr from-purple-400 to-pink-500',
  'bg-gradient-to-tr from-lime-300 to-emerald-500',
  'bg-gradient-to-tr from-amber-400 to-yellow-500',
  // … ещё 30+
]

export function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)]
}