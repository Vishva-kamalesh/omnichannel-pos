export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  POS: '/pos',
  INVENTORY: '/inventory',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  ANALYTICS: '/analytics',
  USERS: '/users',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
