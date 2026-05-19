import { Navigate, Route, Routes } from 'react-router-dom'
import { AnalyticsPage } from '@/features/analytics'
import { DashboardPage } from '@/features/dashboard'
import { InventoryPage } from '@/features/inventory'
import { OrdersPage } from '@/features/orders'
import { PosPage } from '@/features/pos'
import { ProductsPage } from '@/features/products'
import { UsersPage } from '@/features/users'
import { DashboardLayout } from '@/shared/layouts/DashboardLayout'
import { ROUTES } from '@/shared/constants'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.POS} element={<PosPage />} />
        <Route path={ROUTES.INVENTORY} element={<InventoryPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.USERS} element={<UsersPage />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>
    </Routes>
  )
}
