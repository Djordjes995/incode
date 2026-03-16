import { useState } from 'react'
import { DroneCard } from './DroneCard'
import styles from './ShopStep.module.css'
import type { CargoDroneItem, CartItem, DroneItem, FilmingDroneItem } from './shopTypes'

interface ShopStepProps {
  filmingDrones: FilmingDroneItem[]
  cargoDrones: CargoDroneItem[]
  selectedCartItems: CartItem[]
  onAddDrone: (drone: DroneItem, rentalDays: number) => void
}

type CategoryFilter = 'all' | 'filming' | 'cargo'

export function ShopStep({
  filmingDrones,
  cargoDrones,
  selectedCartItems,
  onAddDrone,
}: ShopStepProps) {
  const [rentalDaysByDroneId, setRentalDaysByDroneId] = useState<Record<number, number>>({});
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

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
        <div className={styles.selectedCart}>
          <p className={styles.selectedCount}>Selected items: {selectedCartItems.length}</p>
          {selectedCartItems.length > 0 ? (
            <ul className={styles.cartList}>
              {selectedCartItems.map((item) => (
                <li key={`${item.id}-shop`}>
                  {item.name} x {item.rentalDays} day - ${item.pricePerDay * item.rentalDays}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

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
