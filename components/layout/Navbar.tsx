'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Bio } from '@/utils/data'
import ThemeToggle from '@/components/ThemeToggle'
import SearchModal from '@/components/SearchModal'

interface NavbarProps {
  bio: Bio
}

// Teaching is the primary destination for our biggest audience (students), so
// it is pulled out of the in-page browse links and surfaced first as a real
// route link to the dedicated `/teaching` hub.
const TEACHING_HREF = '/teaching'

interface NavItem {
  label: string
  href: string
  /** Section id for scroll-spy (anchor items only). */
  id?: string
  /** 'route' items are real pages; active state comes from the pathname. */
  kind: 'anchor' | 'route'
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Interests', href: '#interests', id: 'interests', kind: 'anchor' },
  { label: 'Projects', href: '#projects', id: 'projects', kind: 'anchor' },
  {
    label: 'Publications',
    href: '#publications',
    id: 'publications',
    kind: 'anchor',
  },
  { label: 'Videos', href: '#videos', id: 'videos', kind: 'anchor' },
  // The Road lives on its own page — a route link, highlighted by pathname.
  { label: 'The Road', href: '/road', kind: 'route' },
  { label: 'Contact', href: '#contact', id: 'contact', kind: 'anchor' },
]

export default function Navbar({ bio }: NavbarProps) {
  // Section anchors only exist on the home page. On subpages (/road,
  // /teaching, ...) the same items must first navigate home, so their hrefs
  // are prefixed with "/" and the brand becomes a real link to "/".
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Sticky-style background swap on scroll.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view (anchor items only).
  useEffect(() => {
    const sections = NAV_ITEMS.filter((item) => item.id)
      .map((item) => document.getElementById(item.id!))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    // The observer's "upper 40% of the viewport" band never reaches the last,
    // short section (Contact) — the page bottoms out first. When scrolled to
    // (near) the bottom, force-activate the last section instead.
    const atPageBottom = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2

    const observer = new IntersectionObserver(
      (entries) => {
        if (atPageBottom()) {
          setActiveId(sections[sections.length - 1].id)
          return
        }
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when a section is roughly within the upper half of the viewport.
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    )

    sections.forEach((s) => observer.observe(s))

    // The observer only fires on band crossings; slow scrolling can reach the
    // bottom without one, so also check on scroll (passive, cheap boolean).
    const onScroll = () => {
      if (atPageBottom()) setActiveId(sections[sections.length - 1].id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false)
    // Return focus to the toggle button for keyboard users.
    menuButtonRef.current?.focus()
  }, [])

  // Global search shortcuts: Cmd/Ctrl-K, or "/" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setMobileMenuOpen(false)
        return
      }
      if (e.key === '/' && !isMod) {
        const target = e.target as HTMLElement | null
        const tag = target?.tagName
        const isTyping =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          target?.isContentEditable === true
        if (!isTyping) {
          e.preventDefault()
          setSearchOpen(true)
          setMobileMenuOpen(false)
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Mobile menu: lock body scroll, close on Esc / outside click.
  useEffect(() => {
    if (!mobileMenuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [mobileMenuOpen, closeMenu])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-900 shadow-md py-2'
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        {/* Brand: scrolls to top on the home page, navigates home elsewhere. */}
        {isHome ? (
          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {bio.name}
          </a>
        ) : (
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {bio.name}
          </Link>
        )}

        {/* Desktop nav — collapses to hamburger below `lg` to keep links from crowding. */}
        <div className="hidden lg:flex items-center space-x-5">
          {/* Teaching first + semibold: the primary path for students.
              Color follows the active state like every other item, so being
              on /teaching is actually visible. */}
          <Link
            href={TEACHING_HREF}
            aria-current={
              pathname.startsWith(TEACHING_HREF) ? 'page' : undefined
            }
            className={`relative text-sm font-semibold transition-colors ${
              pathname.startsWith(TEACHING_HREF)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Teaching
            {pathname.startsWith(TEACHING_HREF) && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
              />
            )}
          </Link>
          {NAV_ITEMS.map((item) => {
            // Anchors highlight via scroll-spy on the home page; route items
            // highlight when the pathname matches their page.
            const isActive =
              item.kind === 'route'
                ? pathname.startsWith(item.href)
                : isHome && activeId === item.id
            const href =
              item.kind === 'route' || isHome ? item.href : `/${item.href}`
            const className = `relative text-sm transition-colors ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`
            const underline = isActive && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
              />
            )

            return item.kind === 'route' ? (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={className}
              >
                {item.label}
                {underline}
              </Link>
            ) : (
              <a
                key={item.href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={className}
              >
                {item.label}
                {underline}
              </a>
            )
          })}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the site"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
          </button>

          <ThemeToggle />
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the site"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <ThemeToggle />

          <button
            ref={menuButtonRef}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="lg:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <ul className="flex flex-col px-4 py-2">
            <li>
              <Link
                href={TEACHING_HREF}
                onClick={closeMenu}
                aria-current={
                  pathname.startsWith(TEACHING_HREF) ? 'page' : undefined
                }
                className={`block py-3 text-left font-semibold border-b border-gray-100 dark:border-gray-800 transition-colors ${
                  pathname.startsWith(TEACHING_HREF)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Teaching
              </Link>
            </li>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.kind === 'route'
                  ? pathname.startsWith(item.href)
                  : isHome && activeId === item.id
              const href =
                item.kind === 'route' || isHome ? item.href : `/${item.href}`
              const className = `block py-3 text-left transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`

              return (
                <li key={item.href}>
                  {item.kind === 'route' ? (
                    <Link
                      href={href}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={className}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  )
}

