import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'
export type Lang = 'es' | 'en'

export function resolveLang(language: string | undefined): Lang {
  return language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function resolveTheme(prefersDark: boolean): Theme {
  return prefersDark ? 'dark' : 'light'
}

function detectInitialTheme(): Theme {
  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return resolveTheme(prefersDark)
}

function detectInitialLang(): Lang {
  return resolveLang(typeof navigator === 'undefined' ? undefined : navigator.language)
}

interface PreferencesState {
  theme: Theme
  lang: Lang
  setLang: (lang: Lang) => void
  toggleTheme: () => void
}

/**
 * Client-only UI preferences. On the first visit they follow the system
 * (prefers-color-scheme / navigator.language); afterwards they are persisted.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: detectInitialTheme(),
      lang: detectInitialLang(),
      setLang: (lang) => set({ lang }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'tsn-preferences',
      version: 1,
      partialize: ({ theme, lang }) => ({ theme, lang }),
    },
  ),
)

/** Keeps <html class="dark"> and <html lang> in sync with the store. */
export function useApplyPreferences() {
  const theme = usePreferences((s) => s.theme)
  const lang = usePreferences((s) => s.lang)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
}
