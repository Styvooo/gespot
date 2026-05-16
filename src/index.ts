import './index.css'
import './popup/popup.css'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from 'virtual:i18next-loader'

await i18next.use(LanguageDetector).init({
  fallbackLng: {
    default: ['fr']
  },
  supportedLngs: [
    'en',
    'fr'
  ],
  resources: resources,
  debug: import.meta.env.DEV,
  detection: {
    // Don't save language locally. This may need to change if we add a language switcher.
    order: ['querystring', 'navigator'],
    caches: []
  }
})

document.documentElement.lang = i18next.language

// Translate HTML elements.
document.querySelectorAll('[data-i18n]').forEach((element) => {
  const key = element.getAttribute('data-i18n')
  if (key) {
    ;(element as HTMLElement).innerText = i18next.t(key)
  }
})

import Gespot from './gespot'

export const gespot = new Gespot()

if (document.readyState != 'loading') {
  gespot.init()
} else {
  document.addEventListener('DOMContentLoaded', gespot.init)
}
