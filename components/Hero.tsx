'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Bio, SocialLink } from '@/utils/data'
import { SocialIcon } from './icons'

interface HeroProps {
  bio: Bio
  social: SocialLink[]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Hero({ bio, social }: HeroProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = getInitials(bio.name)

  return (
    <section className="py-12 md:py-16 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mb-8 md:mb-0">
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 animate-hero-fade">
          {imageFailed ? (
            <div
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-5xl md:text-6xl font-bold select-none"
              aria-label={bio.name}
              role="img"
            >
              {initials}
            </div>
          ) : (
            <>
              {/* Plain <img> instead of next/image: optimization is disabled for
                  static export anyway, and the bio photo is hosted off-domain. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bio.photo}
                alt={bio.name}
                loading="eager"
                decoding="async"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            </>
          )}
        </div>
      </div>
      <div className="md:w-2/3 md:pl-12 text-center md:text-left max-w-prose animate-hero-fade">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{bio.name}</h1>
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
          {bio.title}
        </h2>
        <p className="mb-4">
          <a
            href={bio.institutionUrl}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {bio.institution}
          </a>
        </p>

        {/* Students are the most frequent, most task-driven visitors. Give them
            an immediate, one-click path to the dedicated teaching hub so they
            never have to scroll or hunt through the nav. */}
        <Link
          href="/teaching"
          className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <span aria-hidden="true">🎓</span>
          Students — course materials
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
          {social.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target={link.url.startsWith('mailto:') ? undefined : '_blank'}
              rel={
                link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'
              }
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-110 transition-all duration-200 inline-flex p-2 -m-2 rounded"
              aria-label={link.platform}
              title={link.platform}
            >
              <SocialIcon name={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
