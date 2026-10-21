import type { Brew } from './App'

// The id is local to each log, so it stays out of the link.
export type SharedBrew = Omit<Brew, 'id'>

const VERSION = 1

// Data goes in the hash so it never reaches a server.
export function toShareUrl({ id: _id, ...brew }: Brew, base = location.href): string {
  const url = new URL(base)
  url.hash = new URLSearchParams({ brew: JSON.stringify({ v: VERSION, ...brew }) }).toString()
  return url.toString()
}

const isText = (x: unknown): x is string => typeof x === 'string'
const isPositive = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x > 0

// The link is untrusted: anything off returns null.
export function fromShareUrl(url: string): SharedBrew | null {
  try {
    const raw = new URLSearchParams(new URL(url).hash.slice(1)).get('brew')
    if (raw === null) return null
    const d = JSON.parse(raw)
    if (
      d?.v !== VERSION ||
      !isText(d.bean) || d.bean.trim() === '' ||
      !isText(d.method) ||
      !isPositive(d.dose) ||
      !isPositive(d.water) ||
      !Number.isInteger(d.rating) || d.rating < 1 || d.rating > 5 ||
      !isText(d.notes) ||
      !isText(d.date) || Number.isNaN(Date.parse(d.date))
    ) {
      return null
    }
    return { bean: d.bean, method: d.method, dose: d.dose, water: d.water, rating: d.rating, notes: d.notes, date: d.date }
  } catch {
    return null
  }
}
