import type { Bio } from '@/utils/data'

interface FooterProps {
  bio?: Bio
}

// Build-time timestamp. Re-evaluated on each `next build`.
const BUILD_DATE = new Date().toISOString().slice(0, 10)

export default function Footer({ bio }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {year} {bio?.name ?? ''}
        </p>
        <p>Updated {BUILD_DATE}</p>
      </div>
    </footer>
  )
}
