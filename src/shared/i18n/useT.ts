import { usePreferences } from '../store/preferences'
import { en, type Dictionary } from './en'
import { es } from './es'

const dictionaries: Record<'es' | 'en', Dictionary> = { es, en }

/** Returns the dictionary for the active language; re-renders when it changes. */
export function useT(): Dictionary {
  const lang = usePreferences((s) => s.lang)
  return dictionaries[lang]
}
