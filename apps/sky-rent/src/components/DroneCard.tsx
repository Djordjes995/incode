import type { DroneItem } from './shopTypes'
import styles from './DroneCard.module.css'

interface DroneCardProps {
  drone: DroneItem
  rentalDays: number
  onDaysChange: (nextValue: string) => void
  onAddToCart: () => void
}

export function DroneCard({ drone, rentalDays, onDaysChange, onAddToCart }: DroneCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img className={styles.droneImage} src={drone.imageUrl} alt={drone.name} />
        <span className={styles.categoryLabel}>
          {drone.category === 'cargo' ? 'Cargo' : 'Filming'}
        </span>
      </div>
      <div>
        <div className={styles.cardContent}>
          <h3 className={styles.itemName}>{drone.name}</h3>
          <p className={styles.description}>{drone.description}</p>
          <p className={styles.itemMeta}>
            {drone.category === 'cargo' ? `${drone.loadCapacityKg}kg load capacity` : drone.cameraQuality}
            {' '} · ${drone.pricePerDay}/day
          </p>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <label className={styles.label}>
          Days:
        </label>
        <input
          className={styles.daysInput}
          min={1}
          max={30}
          type='number'
          value={rentalDays}
          onChange={(event) => onDaysChange(event.target.value)}
        />
        <button className={styles.button} onClick={onAddToCart} type='button'>Add to cart</button>
      </div>
    </article>
  )
}
