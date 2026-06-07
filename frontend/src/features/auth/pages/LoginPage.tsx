import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { getDefaultRouteForRole } from '@/shared/constants'
import { APP_NAME } from '@/shared/constants/navigation'
import styles from './LoginPage.module.css'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

function BrandMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5l8 14 8-14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const sessionExpired = useAuthStore((s) => s.sessionExpired)

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const from = (location.state as { from?: string } | null)?.from

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)
    try {
      const { user, token } = await authService.login({
        email: values.email,
        password: values.password,
      })
      setSession(user, token)
      // Respect an intended destination if the user was bounced here from one;
      // otherwise send them to the default landing page for their role.
      navigate(from ?? getDefaultRouteForRole(user.role), { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message ??
          'Login failed. Please try again.'
        setServerError(message)
      } else {
        setServerError('Unexpected error. Please try again.')
      }
    }
  }

  return (
    <div className={styles.page}>
      {/* Left: quiet editorial zone — identity, one strong line, descriptor */}
      <aside className={styles.leftPanel}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <BrandMark />
          </span>
          <span className={styles.brandName}>{APP_NAME}</span>
        </div>

        <p className={styles.heroLine}>
          Every store, every sale,
          <br />
          one source of truth.
        </p>

        <p className={styles.leftFoot}>
          Point of sale &amp; inventory for multi-store retail.
        </p>
      </aside>

      {/* Right: the form */}
      <section className={styles.rightPanel}>
        <span className={styles.topNote}>
          Need access?{' '}
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() =>
              toast('Account access', {
                description:
                  'Ask your administrator to create a Vendra account for you.',
              })
            }
          >
            Contact your admin
          </button>
        </span>

        <div className={styles.column}>
          <div className={styles.mobileBrand}>
            <span className={styles.brandMark}>
              <BrandMark />
            </span>
            <span className={styles.brandName}>{APP_NAME}</span>
          </div>

          <div className={styles.intro}>
            <h1 className={styles.title}>Sign in to {APP_NAME}</h1>
            <p className={styles.subtitle}>
              Manage inventory, sales, and every store from one workspace.
            </p>
          </div>

          {serverError ? (
            <div className={styles.alert} role="alert">
              {serverError}
            </div>
          ) : sessionExpired ? (
            <div className={styles.notice} role="status">
              Your session expired. Please sign in again.
            </div>
          ) : null}

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@vendra.app"
                className={[styles.input, errors.email ? styles.inputError : '']
                  .filter(Boolean)
                  .join(' ')}
                {...register('email')}
              />
              {errors.email ? (
                <span className={styles.fieldError}>{errors.email.message}</span>
              ) : null}
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() =>
                    toast('Password reset', {
                      description:
                        'Contact your administrator to reset your password.',
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div
                className={[
                  styles.passwordWrap,
                  errors.password ? styles.inputError : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={styles.passwordInput}
                  {...register('password')}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <span className={styles.fieldError}>
                  {errors.password.message}
                </span>
              ) : null}
            </div>

            <label className={styles.checkbox}>
              <input type="checkbox" {...register('remember')} />
              Keep me signed in
            </label>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
