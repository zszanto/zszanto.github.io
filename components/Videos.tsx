'use client'

import { useEffect, useRef, useState } from 'react'
import type { Video } from '@/utils/data'
import SectionHeading from './SectionHeading'

interface VideosProps {
  videos: Video[]
}

/**
 * Clickable thumbnail for a single video. Clicking it doesn't play inline;
 * instead it asks the parent to open the full-screen lightbox. Using a crisp
 * thumbnail (maxresdefault) with a 4:3 fallback keeps the initial payload tiny
 * compared to dropping an <iframe> per video on first render.
 */
function VideoThumbnail({
  video,
  onOpen,
}: {
  video: Video
  onOpen: () => void
}) {
  // maxresdefault is a crisp 16:9 image; it doesn't exist for every video,
  // so fall back to the always-present (4:3) hqdefault on error.
  const maxThumb = `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg`
  const fallbackThumb = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Play ${video.title}`}
        className="absolute inset-0 w-full h-full group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/70"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={maxThumb}
          alt={video.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget
            if (img.src !== fallbackThumb) img.src = fallbackThumb
          }}
          className="w-full h-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <span className="bg-white/90 group-hover:bg-white text-gray-900 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <svg
              className="w-6 h-6 md:w-7 md:h-7 translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  )
}

/**
 * Full-screen lightbox that plays the selected video as large as possible.
 * The iframe is sized to fill the viewport while preserving a 16:9 ratio:
 * `min(95vw, 95vh * 16/9)` guarantees it never overflows on either axis,
 * whether the screen is wide or tall. Closes on ESC, backdrop click, or the
 * close button.
 */
function VideoLightbox({
  video,
  onClose,
}: {
  video: Video
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Use the standard youtube.com host (not youtube-nocookie.com) and avoid the
  // `origin` param: both are common triggers for the mobile "error 153 / video
  // configuration error", especially in less-trusted contexts. `playsinline=1`
  // keeps iOS playing inline instead of failing on a fullscreen handoff. This
  // matches YouTube's own share-embed code as closely as possible.
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`

  // Close on ESC, lock background scroll while open, and move focus to the
  // close button so keyboard users land somewhere sensible.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-[fadeIn_150ms_ease-out]"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/70 transition-colors"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Stop propagation so clicks on the video don't close the lightbox. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-video w-[min(95vw,calc(95vh*16/9))] bg-black rounded-lg overflow-hidden shadow-2xl"
      >
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  )
}

export default function Videos({ videos }: VideosProps) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  return (
    <section
      id="videos"
      className="py-12 border-t border-gray-200 dark:border-gray-700 scroll-mt-24"
    >
      <SectionHeading title="Videos" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => {
          // A lonely last item in an odd-numbered list would otherwise sit
          // half-width with empty space beside it. Center it instead so the
          // section looks intentional at any count (incl. a single video).
          const isLonelyLast =
            videos.length % 2 === 1 && index === videos.length - 1
          return (
            <article
              key={video.youtubeId}
              className={`space-y-3 ${
                isLonelyLast
                  ? 'md:col-span-2 md:max-w-[calc(50%-0.75rem)] md:mx-auto md:w-full'
                  : ''
              }`}
            >
              <VideoThumbnail
                video={video}
                onOpen={() => setActiveVideo(video)}
              />
              <h3 className="text-lg font-medium">{video.title}</h3>
            </article>
          )
        })}
      </div>

      {activeVideo && (
        <VideoLightbox
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  )
}
