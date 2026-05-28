export type UserRole = 'admin' | 'manager' | 'cashier'

export type AuthUser = {
  _id: string
  id?: string
  name: string
  email: string
  role: UserRole
  storeId?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export type ApiErrorResponse = {
  success: false
  message: string
}
