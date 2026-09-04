/** Small presentational helpers shared across components. */

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Deterministic gradient for avatars, derived from the name.
const AVATAR_GRADIENTS = [
  'from-sky-500 to-indigo-500',
  'from-fuchsia-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-indigo-500',
  'from-lime-500 to-green-500',
]

export function avatarGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
