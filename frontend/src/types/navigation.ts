import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  badge?: number
}

export type NavSection = {
  id: string
  title?: string
  items: NavItem[]
}
