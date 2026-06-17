export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  LOGIN: '/login',
  POS: '/pos',
  INVENTORY: '/inventory',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  ANALYTICS: '/analytics',
  USERS: '/users',
  PROFILE: '/profile',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
