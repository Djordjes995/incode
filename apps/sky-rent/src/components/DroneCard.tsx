import type { DroneItem } from './shopTypes'
import styles from './DroneCard.module.css'

interface DroneCardProps {
  drone: DroneItem
  rentalDays: number
  onDaysChange: (nextValue: string) => void
  onAddToCart: () => void
}

type DroneCategory = DroneItem['category']

const CATEGORY_LABELS: Record<DroneCategory, string> = {
  filming: 'Filming',
  cargo: 'Cargo',
}

const CATEGORY_META_FORMATTERS: {
  [K in DroneCategory]: (drone: Extract<DroneItem, { category: K }>) => string
} = {
  filming: (drone) => drone.cameraQuality,
  cargo: (drone) => `${drone.loadCapacityKg}kg load capacity`,
}

function getDroneMeta(drone: DroneItem): string {
  switch (drone.category) {
    case 'filming':
      return CATEGORY_META_FORMATTERS.filming(drone)
    case 'cargo':
      return CATEGORY_META_FORMATTERS.cargo(drone)
  }
}

export function DroneCard({ drone, rentalDays, onDaysChange, onAddToCart }: DroneCardProps) {
  const categoryLabel = CATEGORY_LABELS[drone.category]
  const droneMeta = getDroneMeta(drone)

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img className={styles.droneImage} src={drone.imageUrl} alt={drone.name} />
        <span className={styles.categoryLabel}>
          {categoryLabel}
        </span>
      </div>
      <div>
        <div className={styles.cardContent}>
          <h3 className={styles.itemName}>{drone.name}</h3>
          <p className={styles.description}>{drone.description}</p>
          <p className={styles.itemMeta}>
            {droneMeta}
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
