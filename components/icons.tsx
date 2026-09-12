import {
  FaGithub,
  FaLinkedin,
  FaOrcid,
  FaResearchgate,
  FaGitlab,
  FaYoutube,
  FaTwitter,
  FaGoogleDrive,
  FaRegFileAlt,
  FaChalkboardTeacher,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { SiGooglescholar } from 'react-icons/si'
import { HiMail } from 'react-icons/hi'
import type { IconType } from 'react-icons'
import type { StudentCornerLinkType } from '@/utils/data'


const ICONS: Record<string, IconType> = {
  email: HiMail,
  github: FaGithub,
  gitlab: FaGitlab,
  linkedin: FaLinkedin,
  orcid: FaOrcid,
  googlescholar: SiGooglescholar,
  researchgate: FaResearchgate,
  youtube: FaYoutube,
  twitter: FaTwitter,
}

interface SocialIconProps {
  name: string
  className?: string
}

export function SocialIcon({ name, className = 'w-6 h-6' }: SocialIconProps) {
  const Icon = ICONS[name.toLowerCase()]
  if (!Icon) return null
  return <Icon className={className} aria-hidden="true" />
}

const RESOURCE_ICONS: Record<StudentCornerLinkType, IconType> = {
  doc: FaRegFileAlt,
  drive: FaGoogleDrive,
  github: FaGithub,
  conference: FaChalkboardTeacher,
  external: FaExternalLinkAlt,
}

interface ResourceIconProps {
  type?: StudentCornerLinkType
  className?: string
}

/** Icon for a Student Corner / resource link, keyed by its `type`. */
export function ResourceIcon({
  type = 'external',
  className = 'w-5 h-5',
}: ResourceIconProps) {
  const Icon = RESOURCE_ICONS[type] ?? FaExternalLinkAlt
  return <Icon className={className} aria-hidden="true" />
}

