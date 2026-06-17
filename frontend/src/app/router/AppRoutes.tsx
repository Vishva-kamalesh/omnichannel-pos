import { Navigate, Route, Routes } from 'react-router-dom'
import { AnalyticsPage } from '@/features/analytics'
import { LoginPage, useAuthStore } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { InventoryPage } from '@/features/inventory'
import { OrdersPage } from '@/features/orders'
import { PosPage } from '@/features/pos'
import { ProductsPage } from '@/features/products'
import { ProfilePage } from '@/features/profile'
import { UsersPage } from '@/features/users'
import { DashboardLayout } from '@/shared/layouts/DashboardLayout'
import { ROUTES, getDefaultRouteForRole } from '@/shared/constants'
import { ProtectedRoute } from './ProtectedRoute'

function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.user?.role)
  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />
  }
  return <LoginPage />
}

function DefaultRedirect() {
  const role = useAuthStore((s) => s.user?.role)
  return <Navigate to={getDefaultRouteForRole(role)} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.POS} element={<PosPage />} />
          <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}
