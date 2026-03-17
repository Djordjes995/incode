import styles from './OrderSummary.module.css'
import type { CartItem } from './shopTypes'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
  stepLabel: string
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function OrderSummary({ items, total, stepLabel }: OrderSummaryProps) {
  return (
    <aside className={styles.card} aria-label='Order summary'>
      <p className={styles.eyebrow}>Current step</p>
      <p className={styles.step}>{stepLabel}</p>

      <h2 className={styles.title}>Order summary</h2>

      <p className={styles.meta}>
        {items.length} {items.length === 1 ? 'item' : 'items'}
      </p>

      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.slice(0, 3).map((item, index) => (
            <li key={`${item.id}-${index}`} className={styles.row}>
              <span>{item.name}</span>
              <span>{moneyFormatter.format(item.pricePerDay * item.rentalDays)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No drones selected yet.</p>
      )}

      {items.length > 3 ? (
        <p className={styles.more}>+{items.length - 3} more</p>
      ) : null}

      <div className={styles.totalRow}>
        <span>Total</span>
        <strong>{moneyFormatter.format(total)}</strong>
      </div>
    </aside>
  )
}
