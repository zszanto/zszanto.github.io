import type { SocialLink } from '@/utils/data'
import { SocialIcon } from './icons'
import SectionHeading from './SectionHeading'

interface ContactProps {
  social?: SocialLink[]
}

/**
 * A static export cannot host a real form endpoint, so this surfaces the
 * actual contact channels (email + other links from social.json) instead.
 * To add a real form, wire up a Formspree/Web3Forms endpoint in a client
 * component.
 */
export default function Contact({ social = [] }: ContactProps) {
  const emailLink = social.find((link) => link.platform.toLowerCase() === 'email')
  const otherLinks = social.filter((link) => link !== emailLink)

  return (
    <section
      id="contact"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Contact" />

      {emailLink ? (
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          The fastest way to reach me is by email:{' '}
          <a
            href={emailLink.url}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-all"
          >
            {emailLink.url.replace(/^mailto:/, '')}
          </a>
          .
        </p>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Please reach out via one of the channels below.
        </p>
      )}

      {otherLinks.length > 0 && (
        <ul className="flex flex-wrap gap-4">
          {otherLinks.map((link) => (
            <li key={link.platform}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
              >
                <SocialIcon name={link.icon} className="w-5 h-5" />
                <span>{link.platform}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
