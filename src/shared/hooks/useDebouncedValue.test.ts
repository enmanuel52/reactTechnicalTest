import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('only updates after the value has been stable for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })
    expect(result.current).toBe('a')

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('a')

    rerender({ value: 'abc' }) // typing again restarts the timer
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('abc')
  })
})
