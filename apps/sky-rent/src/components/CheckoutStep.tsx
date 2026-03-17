import type { IdentityResult } from '@incode/identity-sdk'
import styles from './CheckoutStep.module.css'
import type { CartItem } from './shopTypes'

interface CheckoutStepProps {
  result: IdentityResult
  selectedCartItems: CartItem[]
  cartTotal: number
  rentalCompleted: boolean
}

export function CheckoutStep({
  result,
  selectedCartItems,
  cartTotal,
  rentalCompleted,
}: CheckoutStepProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Checkout</h3>
        <p className={styles.subtitle}>Review your order and complete the rental.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h4 className={styles.heading}>Cart</h4>

            {selectedCartItems.length > 0 ? (
              <ul className={styles.list}>
                {selectedCartItems.map((item) => (
                  <li key={`${item.id}-checkout`} className={styles.item}>
                    <span>{item.name}</span>
                    <span>
                      {item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'} -
                    </span>
                    <span className={styles.price}>${item.pricePerDay * item.rentalDays}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={styles.total}>
              <span>Total:</span>
              <strong>${cartTotal}</strong>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.heading}>Verified Identity</h4>
            <div className={styles.row}>
              <span className={styles.label}>Status</span>
              <span className={styles.success}>{result.status}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Phone</span>
              <span>{result.phone}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Address</span>
              <span>
                {result.address.street}, {result.address.city}, {result.address.state},{' '}
                {result.address.country} {result.address.postalCode}
              </span>
            </div>
          </div>
        </div>

        {rentalCompleted ? (
          <p className={styles.completion}>Rental completed successfully!</p>
        ) : null}
      </div>
    </div>
  )
}
