import {
  BarChart3,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  Users,
  Warehouse,
} from 'lucide-react'
import type { NavSection } from '@/types/navigation'
import type { UserRole } from '@/features/auth/types/auth.types'
import { ROUTES } from './routes'

// Role visibility mirrors the backend route guards (see backend/src/modules/*).
// Items without a `roles` field are visible to every authenticated user.
export const MAIN_NAVIGATION: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: ['admin', 'manager'],
      },
      {
        id: 'pos',
        label: 'POS Terminal',
        path: ROUTES.POS,
        icon: Store,
      },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog & Stock',
    items: [
      {
        id: 'inventory',
        label: 'Inventory',
        path: ROUTES.INVENTORY,
        icon: Warehouse,
      },
      {
        id: 'products',
        label: 'Products',
        path: ROUTES.PRODUCTS,
        icon: Package,
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    items: [
      {
        id: 'orders',
        label: 'Orders',
        path: ROUTES.ORDERS,
        icon: ShoppingCart,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: ROUTES.ANALYTICS,
        icon: BarChart3,
        roles: ['admin', 'manager'],
      },
      {
        id: 'users',
        label: 'Users',
        path: ROUTES.USERS,
        icon: Users,
        roles: ['admin', 'manager'],
      },
    ],
  },
]

/**
 * Returns navigation with items the given role may not access removed, and any
 * section left empty dropped. Falls back to the full menu when role is unknown.
 */
export function filterNavigationByRole(
  sections: NavSection[],
  role: UserRole | undefined,
): NavSection[] {
  if (!role) return sections
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role),
      ),
    }))
    .filter((section) => section.items.length > 0)
}

/**
 * The page a role should land on after login. Cashiers can't see the Dashboard
 * (analytics is admin/manager only), so they go straight to the POS terminal.
 */
export function getDefaultRouteForRole(role: UserRole | undefined): string {
  return role === 'cashier' ? ROUTES.POS : ROUTES.DASHBOARD
}

export const APP_NAME = 'Vendra'
export const DEFAULT_STORE_NAME = 'Downtown Flagship'
