'use client'

import { useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', isDark)
  root.dataset.theme = theme
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Read the persisted theme on mount (the pre-paint script has already
  // applied the correct class, so this only syncs React state).
  // Match the layout's smart default: 'auto' on mobile, 'dark' on desktop.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored) {
      setTheme(stored)
    } else {
      const isMobile =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(max-width: 768px)').matches
      setTheme(isMobile ? 'auto' : 'dark')
    }
    setMounted(true)
  }, [])

  // React to system preference changes when in 'auto'.
  useEffect(() => {
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('auto')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  // Close the menu when clicking outside.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const choose = (next: Theme) => {
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
    setOpen(false)
  }

  // Render a neutral icon until mount to avoid hydration mismatch
  // (the pre-paint script may have already set dark on <html>).
  const currentIcon = !mounted ? (
    <SunMoonIcon />
  ) : theme === 'light' ? (
    <SunIcon />
  ) : theme === 'dark' ? (
    <MoonIcon />
  ) : (
    <SunMoonIcon />
  )

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Display preferences"
        aria-haspopup="menu"
        aria-expanded={open}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {currentIcon}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50"
        >
          {(['light', 'dark', 'auto'] as Theme[]).map((opt) => (
            <button
              key={opt}
              role="menuitemradio"
              aria-checked={theme === opt}
              onClick={() => choose(opt)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === opt
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {opt === 'light' && <SunIcon />}
              {opt === 'dark' && <MoonIcon />}
              {opt === 'auto' && <SunMoonIcon />}
              <span className="capitalize">{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunMoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}
