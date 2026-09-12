import {
  FaGithub,
  FaLinkedin,
  FaOrcid,
  FaResearchgate,
  FaGitlab,
  FaBitbucket,
  FaYoutube,
  FaTwitter,
  FaGoogleDrive,
  FaRegFileAlt,
  FaChalkboardTeacher,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { SiGooglescholar, SiDblp } from 'react-icons/si'
import { HiMail } from 'react-icons/hi'
import type { IconType } from 'react-icons'
import type { StudentCornerLinkType } from '@/utils/data'


const ICONS: Record<string, IconType> = {
  email: HiMail,
  github: FaGithub,
  gitlab: FaGitlab,
  bitbucket: FaBitbucket,
  linkedin: FaLinkedin,
  orcid: FaOrcid,
  googlescholar: SiGooglescholar,
  researchgate: FaResearchgate,
  dblp: SiDblp,
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

