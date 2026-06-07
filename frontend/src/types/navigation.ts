import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/features/auth/types/auth.types'

export type NavItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  badge?: number
  /** Roles allowed to see this item. Omit to make it visible to every role. */
  roles?: UserRole[]
}

export type NavSection = {
  id: string
  title?: string
  items: NavItem[]
}
