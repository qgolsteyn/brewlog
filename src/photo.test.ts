import { expect, test } from 'vitest'
import { fitWithin } from './photo'

test('fitWithin caps the long side, keeps the ratio, never scales up', () => {
  expect(fitWithin(4000, 3000, 800)).toEqual({ width: 800, height: 600 })
  expect(fitWithin(3000, 4000, 800)).toEqual({ width: 600, height: 800 })
  expect(fitWithin(640, 480, 800)).toEqual({ width: 640, height: 480 })
})
