import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Modal } from '@/shared/ui/Modal'
import { usersApi, type StoreOption } from '../../services/usersApi'
import styles from './UserFormModal.module.css'

const userSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'manager', 'cashier']),
  storeId: z.string().optional(),
})

type UserFormValues = z.infer<typeof userSchema>

const DEFAULTS: UserFormValues = {
  name: '',
  email: '',
  password: '',
  role: 'cashier',
  storeId: '',
}

type UserFormModalProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void | Promise<void>
}

export function UserFormModal({ open, onClose, onCreated }: UserFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [stores, setStores] = useState<StoreOption[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULTS,
  })

  // Reset the form and load stores each time the modal opens.
  useEffect(() => {
    if (!open) return
    reset(DEFAULTS)
    setServerError(null)
    let active = true
    usersApi
      .listStores()
      .then((list) => {
        if (active) setStores(list)
      })
      .catch(() => {
        if (active) setStores([])
      })
    return () => {
      active = false
    }
  }, [open, reset])

  async function onSubmit(values: UserFormValues) {
    setServerError(null)
    try {
      await usersApi.create({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
        storeId: values.storeId || undefined,
      })
      toast.success('User created', {
        description: `${values.name.trim()} can now sign in.`,
      })
      await onCreated()
      onClose()
    } catch (err) {
      let message = 'Could not create the user. Please try again.'
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      setServerError(message)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add user"
      description="Create a staff account and assign their role."
    >
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError ? (
          <div className={styles.serverError} role="alert">
            {serverError}
          </div>
        ) : null}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="user-name">
            Full name<span className={styles.required}>*</span>
          </label>
          <input
            id="user-name"
            className={styles.input}
            autoComplete="off"
            placeholder="e.g. Priya Sharma"
            {...register('name')}
          />
          {errors.name ? (
            <span className={styles.error}>{errors.name.message}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="user-email">
            Email<span className={styles.required}>*</span>
          </label>
          <input
            id="user-email"
            type="email"
            className={styles.input}
            autoComplete="off"
            placeholder="name@vendra.app"
            {...register('email')}
          />
          {errors.email ? (
            <span className={styles.error}>{errors.email.message}</span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="user-password">
            Temporary password<span className={styles.required}>*</span>
          </label>
          <input
            id="user-password"
            type="password"
            className={styles.input}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register('password')}
          />
          {errors.password ? (
            <span className={styles.error}>{errors.password.message}</span>
          ) : (
            <span className={styles.hint}>
              Share this with the user; they can change it later.
            </span>
          )}
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="user-role">
              Role<span className={styles.required}>*</span>
            </label>
            <select id="user-role" className={styles.select} {...register('role')}>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="user-store">
              Store
            </label>
            <select
              id="user-store"
              className={styles.select}
              {...register('storeId')}
            >
              <option value="">No specific store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.location ? `${store.name} — ${store.location}` : store.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating…' : 'Create user'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
