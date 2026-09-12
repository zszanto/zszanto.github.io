import Link from 'next/link'

interface BackButtonProps {
  /** Target to navigate back to (e.g. homepage section anchor). */
  href: string
  label?: string
}

/**
 * "Back" control for sub-pages (e.g. course pages).
 *
 * Uses a Next.js <Link> for a reliable client-side navigation back to the
 * given section anchor. This always works (no dependency on referrer or
 * history state) and automatically respects the configured `basePath`.
 */
export default function BackButton({
  href,
  label = 'Back',
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        ←
      </span>
      {label}
    </Link>
  )
}
