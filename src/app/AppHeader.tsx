import { MoonIcon, SunIcon } from '@/shared/ui/icons'
import { IconButton } from '@/shared/ui/IconButton'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { useT } from '@/shared/i18n/useT'
import { usePreferences, type Lang } from '@/shared/store/preferences'

const LANGUAGES = [
  { value: 'es', label: 'ES', ariaLabel: 'Español', lang: 'es' },
  { value: 'en', label: 'EN', ariaLabel: 'English', lang: 'en' },
] as const satisfies readonly { value: Lang; label: string; ariaLabel: string; lang: string }[]

export function AppHeader() {
  const t = useT()
  const theme = usePreferences((s) => s.theme)
  const lang = usePreferences((s) => s.lang)
  const setLang = usePreferences((s) => s.setLang)
  const toggleTheme = usePreferences((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 bg-surface pr-2 pl-4 md:pl-6">
      <span className="flex-1 text-[22px] leading-7">
        the<span className="font-medium text-primary">Social</span>Network
      </span>
      <SegmentedControl label={t.appLanguage} options={LANGUAGES} value={lang} onChange={setLang} />
      <IconButton label={isDark ? t.switchToLight : t.switchToDark} onClick={toggleTheme}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </header>
  )
}
