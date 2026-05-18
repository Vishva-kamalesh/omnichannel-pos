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
import { ROUTES } from './routes'

export const MAIN_NAVIGATION: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
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
        badge: 12,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: ROUTES.ANALYTICS,
        icon: BarChart3,
      },
      {
        id: 'users',
        label: 'Users',
        path: ROUTES.USERS,
        icon: Users,
      },
    ],
  },
]

export const APP_NAME = 'OmniPOS'
export const DEFAULT_STORE_NAME = 'Downtown Flagship'
