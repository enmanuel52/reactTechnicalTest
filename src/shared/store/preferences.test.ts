import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { resolveLang, resolveTheme, useApplyPreferences, usePreferences } from './preferences'

describe('preference detection', () => {
  it('uses Spanish only for Spanish browser languages', () => {
    expect(resolveLang('es-MX')).toBe('es')
    expect(resolveLang('ES')).toBe('es')
    expect(resolveLang('en-US')).toBe('en')
    expect(resolveLang('fr-FR')).toBe('en')
    expect(resolveLang(undefined)).toBe('en')
  })

  it('maps the system colour scheme to a theme', () => {
    expect(resolveTheme(true)).toBe('dark')
    expect(resolveTheme(false)).toBe('light')
  })
})

describe('usePreferences', () => {
  beforeEach(() => {
    usePreferences.setState({ theme: 'light', lang: 'en' })
    document.documentElement.className = ''
    document.documentElement.lang = ''
  })

  it('toggles the theme and reflects it on <html>', () => {
    renderHook(() => useApplyPreferences())
    expect(document.documentElement).not.toHaveClass('dark')

    act(() => usePreferences.getState().toggleTheme())
    expect(usePreferences.getState().theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')

    act(() => usePreferences.getState().toggleTheme())
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('changes the language and reflects it on <html lang>', () => {
    renderHook(() => useApplyPreferences())
    expect(document.documentElement.lang).toBe('en')

    act(() => usePreferences.getState().setLang('es'))
    expect(document.documentElement.lang).toBe('es')
  })

  it('persists the preferences to localStorage', () => {
    act(() => usePreferences.getState().setLang('es'))
    const saved = JSON.parse(localStorage.getItem('tsn-preferences') ?? '{}')
    expect(saved.state).toEqual({ theme: 'light', lang: 'es' })
  })
})
