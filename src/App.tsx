import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

export type Brew = {
  id: string
  bean: string
  method: string
  dose: number
  water: number
  rating: number
  notes: string
  date: string
}

const METHODS = ['V60', 'AeroPress', 'Chemex', 'French press', 'Espresso']
const STORAGE_KEY = 'brewlog.brews'

const load = (): Brew[] => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')

export default function App() {
  const [brews, setBrews] = useState<Brew[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brews))
  }, [brews])

  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const brew: Brew = {
      id: crypto.randomUUID(),
      bean: String(form.get('bean')),
      method: String(form.get('method')),
      dose: Number(form.get('dose')),
      water: Number(form.get('water')),
      rating: Number(form.get('rating')),
      notes: String(form.get('notes')),
      date: new Date().toISOString(),
    }
    setBrews([brew, ...brews])
    event.currentTarget.reset()
  }

  return (
    <main>
      <h1>☕ Brewlog</h1>
      <p className="tagline">Remember the cup you liked.</p>

      <form onSubmit={add}>
        <input name="bean" placeholder="Bean (e.g. Ethiopia Guji)" required />
        <select name="method">
          {METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <label>
          Dose (g) <input name="dose" type="number" min="1" defaultValue="15" required />
        </label>
        <label>
          Water (g) <input name="water" type="number" min="1" defaultValue="250" required />
        </label>
        <label>
          Rating <input name="rating" type="range" min="1" max="5" defaultValue="3" />
        </label>
        <textarea name="notes" placeholder="Tasting notes" />
        <button>Log brew</button>
      </form>

      {brews.length === 0 ? (
        <p className="empty">No brews yet. Log your first cup above.</p>
      ) : (
        <ul>
          {brews.map((b) => (
            <li key={b.id}>
              <header>
                <strong>{b.bean}</strong>
                <span>{'★'.repeat(b.rating)}{'☆'.repeat(5 - b.rating)}</span>
              </header>
              <small>
                {b.method} · {b.dose}g : {b.water}g (1:{(b.water / b.dose).toFixed(1)}) ·{' '}
                {new Date(b.date).toLocaleDateString()}
              </small>
              {b.notes && <p>{b.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
