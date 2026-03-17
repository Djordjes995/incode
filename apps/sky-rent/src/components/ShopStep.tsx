import { useState } from 'react'
import { DroneCard } from './DroneCard'
import styles from './ShopStep.module.css'
import type { CargoDroneItem, CartItem, DroneItem, FilmingDroneItem } from './shopTypes'
import appStyles from '../App.module.css'

interface ShopStepProps {
  filmingDrones: FilmingDroneItem[]
  cargoDrones: CargoDroneItem[]
  selectedCartItems: CartItem[]
  onAddDrone: (drone: DroneItem, rentalDays: number) => void
  onRemoveCartItem: (id: number) => void
  onUpdateCartItemDays: (id: number, rentalDays: number) => void
  onGoNext: () => void
}

type CategoryFilter = 'all' | 'filming' | 'cargo'

export function ShopStep({
  filmingDrones,
  cargoDrones,
  selectedCartItems,
  onAddDrone,
  onRemoveCartItem,
  onUpdateCartItemDays,
  onGoNext,
}: ShopStepProps) {
  const [rentalDaysByDroneId, setRentalDaysByDroneId] = useState<Record<number, number>>({});
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [isCartExpanded, setIsCartExpanded] = useState(false)

  const getDays = (droneId: number) => rentalDaysByDroneId[droneId] ?? 1;

  const updateDays = (droneId: number, nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const safeDays = Number.isFinite(parsed) ? Math.min(30, Math.max(1, parsed)) : 1;
    setRentalDaysByDroneId((current) => ({
      ...current,
      [droneId]: safeDays,
    }));
  };

  const filteredDrones: DroneItem[] =
    activeFilter === 'all'
      ? [...filmingDrones, ...cargoDrones]
      : activeFilter === 'filming'
        ? filmingDrones
        : cargoDrones;

  const selectedTotal = selectedCartItems.reduce(
    (total, item) => total + item.pricePerDay * item.rentalDays,
    0,
  )

  return (
    <section className={styles.section}>
      <h2>Browse and Select Drones</h2>
      <p className={styles.description}>Select at least one drone to continue.</p>

      <div className={styles.filterRow}>
        <div className={styles.filterButtons}>
          <button
            className={styles.filterButton}
            data-active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            type='button'
          >
            All
          </button>
          <button
            className={styles.filterButton}
            data-active={activeFilter === 'filming'}
            onClick={() => setActiveFilter('filming')}
            type='button'
          >
            Filming
          </button>
          <button
            className={styles.filterButton}
            data-active={activeFilter === 'cargo'}
            onClick={() => setActiveFilter('cargo')}
            type='button'
          >
            Cargo
          </button>
        </div>
        <button
          type='button'
          className={styles.selectedCartTrigger}
          onClick={() => setIsCartExpanded((current) => !current)}
          aria-expanded={isCartExpanded}
          aria-controls='selected-cart-panel'
        >
          <span className={styles.selectedCount}>
            {selectedCartItems.length} {selectedCartItems.length === 1 ? 'item' : 'items'} selected
          </span>
          <strong className={styles.selectedTotal}>${selectedTotal}</strong>
        </button>
      </div>

      {isCartExpanded && selectedCartItems.length > 0 ? (
        <div
          id='selected-cart-panel'
          className={styles.selectedCartPanel}
          aria-label='Selected items details'
        >
          <ul className={styles.cartList}>
            {selectedCartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <span className={styles.cartItemName}>{item.name} - ${item.pricePerDay}/day</span>
                <label className={styles.daysControl}>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={item.rentalDays}
                    onChange={(e) => {
                      const v = Number.parseInt(e.target.value, 10)
                      if (Number.isFinite(v)) onUpdateCartItemDays(item.id, v)
                    }}
                    aria-label={`Rental days for ${item.name}`}
                  />
                  <span>Days</span>
                </label>
                <span className={styles.cartItemPrice}>${item.pricePerDay * item.rentalDays}</span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemoveCartItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.selectedCartTotal}>
            <div>
              <span>Total: </span>
              <strong>${selectedTotal}</strong>
            </div>
            <button className={appStyles.primaryButton} type='button' onClick={onGoNext}>Go to Verification</button>
          </div>
        </div>
      ) : null}

      <div className={styles.grid}>
        {filteredDrones.map((drone) => (
          <DroneCard
            key={drone.id}
            drone={drone}
            rentalDays={getDays(drone.id)}
            onDaysChange={(nextValue) => updateDays(drone.id, nextValue)}
            onAddToCart={() => onAddDrone(drone, getDays(drone.id))}
          />
        ))}
      </div>
    </section>
  )
}
