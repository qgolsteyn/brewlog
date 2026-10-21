import { describe, expect, it } from 'vitest'
import type { Brew } from './App'
import { fromShareUrl, toShareUrl } from './share'

const BASE = 'https://qgolsteyn.github.io/brewlog/'
const brew: Brew = {
  id: 'abc',
  bean: 'Ethiopia Guji — café & “fruit” #1',
  method: 'V60',
  dose: 15,
  water: 250,
  rating: 4,
  notes: 'Blueberry, jasmine',
  date: '2026-10-01T08:30:00.000Z',
}
const { id: _id, ...shared } = brew

const link = (data: unknown) => `${BASE}#${new URLSearchParams({ brew: JSON.stringify(data) })}`

describe('share links', () => {
  it('round trips a brew without its id', () => {
    const url = toShareUrl(brew, BASE)
    expect(url.startsWith(`${BASE}#brew=`)).toBe(true)
    expect(fromShareUrl(url)).toEqual(shared)
  })

  it('encodes an old brew with empty notes', () => {
    expect(fromShareUrl(toShareUrl({ ...brew, notes: '' }, BASE))).toEqual({ ...shared, notes: '' })
  })

  it('replaces an existing hash on the base url', () => {
    expect(fromShareUrl(toShareUrl(brew, `${BASE}#old`))).toEqual(shared)
  })

  it.each([
    ['no hash', BASE],
    ['other hash', `${BASE}#foo=bar`],
    ['not json', `${BASE}#brew=%7Bnope`],
    ['not a url', 'nope'],
    ['null payload', link(null)],
    ['missing version', link(shared)],
    ['unknown version', link({ v: 2, ...shared })],
    ['rating 0', link({ v: 1, ...shared, rating: 0 })],
    ['rating 6', link({ v: 1, ...shared, rating: 6 })],
    ['fractional rating', link({ v: 1, ...shared, rating: 2.5 })],
    ['zero dose', link({ v: 1, ...shared, dose: 0 })],
    ['negative water', link({ v: 1, ...shared, water: -1 })],
    ['dose as string', link({ v: 1, ...shared, dose: '15' })],
    ['empty bean', link({ v: 1, ...shared, bean: ' ' })],
    ['missing notes', link({ v: 1, ...shared, notes: undefined })],
    ['bad date', link({ v: 1, ...shared, date: 'yesterday' })],
  ])('returns null for %s', (_, url) => {
    expect(fromShareUrl(url)).toBeNull()
  })

  it('drops extra fields from a tampered link', () => {
    expect(fromShareUrl(link({ v: 1, ...shared, id: 'x', evil: '<script>' }))).toEqual(shared)
  })
})
