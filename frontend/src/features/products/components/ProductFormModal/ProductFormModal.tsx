import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/shared/ui/Modal'
import { PRODUCT_COLORS } from '../../data/productsMock'
import type { Product, ProductStatus } from '../../types/product.types'
import styles from './ProductFormModal.module.css'

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const variantSchema = z.object({
  size: z.string().trim().min(1, 'Required'),
  color: z.string().trim().min(1, 'Required'),
  stock: z
    .string()
    .trim()
    .min(1, 'Required')
    .refine((value) => /^\d+$/.test(value), 'Whole number'),
})

const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters'),
  sku: z
    .string()
    .trim()
    .min(3, 'SKU must be at least 3 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers, and dashes only'),
  category: z.string().min(1, 'Select a category'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((value) => Number(value) > 0, 'Enter a price greater than 0'),
  status: z.enum(['active', 'draft', 'archived']),
  variants: z.array(variantSchema).min(1, 'Add at least one variant'),
})

type ProductFormValues = z.infer<typeof productSchema>

/** Impure helpers kept at module scope — they read "now" at submit time. */
function generateProductId(): string {
  return `prd-${Date.now().toString(36)}`
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function toFormValues(product: Product | null): ProductFormValues {
  if (!product) {
    return {
      name: '',
      sku: '',
      category: '',
      price: '',
      status: 'active',
      variants: [{ size: '', color: '', stock: '' }],
    }
  }
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price.toString(),
    status: product.status,
    variants: product.variants.map((variant) => ({
      size: variant.size,
      color: variant.color,
      stock: variant.stock.toString(),
    })),
  }
}

type ProductFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  product: Product | null
  categories: readonly string[]
  onClose: () => void
  onSubmit: (product: Product) => void
}

export function ProductFormModal({
  open,
  mode,
  product,
  categories,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toFormValues(product),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  // Re-seed the form whenever the dialog opens for a new or different product.
  useEffect(() => {
    if (open) reset(toFormValues(product))
  }, [open, product, reset])

  function submitForm(values: ProductFormValues) {
    const id = product?.id ?? generateProductId()
    const next: Product = {
      id,
      name: values.name.trim(),
      sku: values.sku.trim().toUpperCase(),
      category: values.category,
      price: Number(values.price),
      status: values.status,
      variants: values.variants.map((variant, index) => ({
        id: `${id}-v${(index + 1).toString().padStart(2, '0')}`,
        size: variant.size.trim(),
        color: variant.color.trim(),
        stock: Number(variant.stock),
      })),
      updatedAt: todayLabel(),
    }
    onSubmit(next)
  }

  const inputClass = (hasError: boolean) =>
    [styles.input, hasError ? styles.inputError : ''].filter(Boolean).join(' ')
  const selectClass = (hasError: boolean) =>
    [styles.select, hasError ? styles.inputError : ''].filter(Boolean).join(' ')

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={mode === 'edit' ? 'Edit product' : 'Add product'}
      description={
        mode === 'edit'
          ? 'Update product details, pricing, and variants.'
          : 'Create a new catalog product with its variants.'
      }
      footer={
        <>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className={styles.submitBtn}
          >
            {mode === 'edit' ? 'Save changes' : 'Add product'}
          </button>
        </>
      }
    >
      <form
        id="product-form"
        className={styles.form}
        onSubmit={handleSubmit(submitForm)}
        noValidate
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-name">
            Product name<span className={styles.required}>*</span>
          </label>
          <input
            id="product-name"
            className={inputClass(Boolean(errors.name))}
            placeholder="e.g. Classic Cotton T-Shirt"
            {...register('name')}
          />
          {errors.name ? (
            <p className={styles.error}>{errors.name.message}</p>
          ) : null}
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-sku">
              SKU<span className={styles.required}>*</span>
            </label>
            <input
              id="product-sku"
              className={inputClass(Boolean(errors.sku))}
              placeholder="e.g. APP-1042"
              {...register('sku')}
            />
            {errors.sku ? (
              <p className={styles.error}>{errors.sku.message}</p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-category">
              Category<span className={styles.required}>*</span>
            </label>
            <select
              id="product-category"
              className={selectClass(Boolean(errors.category))}
              {...register('category')}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className={styles.error}>{errors.category.message}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-price">
              Price (₹)<span className={styles.required}>*</span>
            </label>
            <input
              id="product-price"
              inputMode="decimal"
              className={inputClass(Boolean(errors.price))}
              placeholder="0"
              {...register('price')}
            />
            {errors.price ? (
              <p className={styles.error}>{errors.price.message}</p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-status">
              Status
            </label>
            <select
              id="product-status"
              className={styles.select}
              {...register('status')}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.variants}>
          <div className={styles.variantsHeader}>
            <span className={styles.label}>
              Variants<span className={styles.required}>*</span>
            </span>
            <button
              type="button"
              className={styles.addVariant}
              onClick={() => append({ size: '', color: '', stock: '' })}
            >
              <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
              Add variant
            </button>
          </div>

          <div className={styles.variantList}>
            <div className={styles.variantHead}>
              <span>Size</span>
              <span>Color</span>
              <span>Stock</span>
              <span aria-hidden="true" />
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.variantRow}>
                <div>
                  <input
                    className={inputClass(Boolean(errors.variants?.[index]?.size))}
                    placeholder="M / 9 / One Size"
                    aria-label={`Variant ${index + 1} size`}
                    {...register(`variants.${index}.size`)}
                  />
                  {errors.variants?.[index]?.size ? (
                    <p className={styles.error}>
                      {errors.variants[index]?.size?.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <select
                    className={selectClass(
                      Boolean(errors.variants?.[index]?.color),
                    )}
                    aria-label={`Variant ${index + 1} color`}
                    {...register(`variants.${index}.color`)}
                  >
                    <option value="">Color</option>
                    {PRODUCT_COLORS.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  {errors.variants?.[index]?.color ? (
                    <p className={styles.error}>
                      {errors.variants[index]?.color?.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <input
                    inputMode="numeric"
                    className={inputClass(
                      Boolean(errors.variants?.[index]?.stock),
                    )}
                    placeholder="0"
                    aria-label={`Variant ${index + 1} stock`}
                    {...register(`variants.${index}.stock`)}
                  />
                  {errors.variants?.[index]?.stock ? (
                    <p className={styles.error}>
                      {errors.variants[index]?.stock?.message}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={styles.removeVariant}
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  aria-label={`Remove variant ${index + 1}`}
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
          {errors.variants?.root ? (
            <p className={styles.error}>{errors.variants.root.message}</p>
          ) : null}
        </div>
      </form>
    </Modal>
  )
}
