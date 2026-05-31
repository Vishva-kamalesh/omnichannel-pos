import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
} from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '@/shared/constants'
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

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)

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

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)
    try {
      const { user, token } = await authService.login({
        email: values.email,
        password: values.password,
      })
      setSession(user, token)
      navigate(redirectTo, { replace: true })
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
      <aside className={styles.brandPanel}>
        <div className={styles.brandHeader}>
          <span className={styles.brandMark}>
            <Store size={20} strokeWidth={2} />
          </span>
          <span>{APP_NAME}</span>
        </div>

        <div className={styles.brandContent}>
          <span className={styles.brandKicker}>
            <Sparkles size={12} strokeWidth={2.5} />
            Enterprise POS Platform
          </span>
          <h1 className={styles.brandTitle}>
            Run every counter, channel, and warehouse from one place.
          </h1>
          <p className={styles.brandSubtitle}>
            Sign in to manage inventory, ring up sales, and watch your stores
            perform in real time.
          </p>
        </div>

        <div className={styles.brandStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>240+</span>
            <span className={styles.statLabel}>Stores</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>1.4M</span>
            <span className={styles.statLabel}>Orders / mo</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>99.99%</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
        </div>
      </aside>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.mobileBrand}>
            <Store size={18} strokeWidth={2.25} />
            {APP_NAME}
          </div>

          <div className={styles.heading}>
            <h2 className={styles.title}>Sign in to your workspace</h2>
            <p className={styles.subtitle}>
              Use the credentials provided by your administrator.
            </p>
          </div>

          {serverError ? (
            <div className={styles.alert} role="alert">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{serverError}</span>
            </div>
          ) : null}

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Work email
              </label>
              <div
                className={[
                  styles.inputWrap,
                  errors.email ? styles.inputWrapError : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Mail size={16} strokeWidth={2} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={styles.input}
                  {...register('email')}
                />
              </div>
              {errors.email ? (
                <span className={styles.fieldError}>{errors.email.message}</span>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <div
                className={[
                  styles.inputWrap,
                  errors.password ? styles.inputWrapError : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Lock size={16} strokeWidth={2} aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={styles.input}
                  {...register('password')}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={2} />
                  ) : (
                    <Eye size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password ? (
                <span className={styles.fieldError}>
                  {errors.password.message}
                </span>
              ) : null}
            </div>

            <div className={styles.row}>
              <label className={styles.checkbox}>
                <input type="checkbox" {...register('remember')} />
                Keep me signed in
              </label>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() =>
                  alert('Please contact your administrator to reset your password.')
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} strokeWidth={2.25} />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <ShieldCheck size={12} strokeWidth={2.5} />
            Secured by JWT
          </div>

          <div className={styles.demoBox}>
            <strong>Demo credentials</strong>
            <span>admin@omnipos.com / Admin@12345</span>
            <span>
              Don&apos;t have an account? Ask an admin to create one via the Users
              module.
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
