import { useState } from 'react'
import styles from './ShopStep.module.css'

export interface BaseDroneItem {
  id: number
  name: string
  pricePerDay: number
  imageUrl: string
}

export interface FilmingDroneItem extends BaseDroneItem {
  category: 'filming'
  cameraQuality: string
}

export interface CargoDroneItem extends BaseDroneItem {
  category: 'cargo'
  loadCapacityKg: number
}

export type DroneItem = FilmingDroneItem | CargoDroneItem

export interface CartItem extends BaseDroneItem {
  category: 'filming' | 'cargo'
  rentalDays: number
  loadCapacityKg?: number
  cameraQuality?: string
}

interface ShopStepProps {
  filmingDrones: FilmingDroneItem[]
  cargoDrones: CargoDroneItem[]
  selectedCartItems: CartItem[]
  onAddDrone: (drone: DroneItem, rentalDays: number) => void
}

export function ShopStep({
  filmingDrones,
  cargoDrones,
  selectedCartItems,
  onAddDrone,
}: ShopStepProps) {
  const [rentalDaysByDroneId, setRentalDaysByDroneId] = useState<Record<number, number>>({});

  const getDays = (droneId: number) => rentalDaysByDroneId[droneId] ?? 1;

  const updateDays = (droneId: number, nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const safeDays = Number.isFinite(parsed) ? Math.min(30, Math.max(1, parsed)) : 1;
    setRentalDaysByDroneId((current) => ({
      ...current,
      [droneId]: safeDays,
    }));
  };

  return (
    <section className={styles.section}>
      <h2>Browse and Select Drones</h2>
      <p className={styles.description}>Select at least one drone to continue.</p>

      <h3 className={styles.category}>Filming Drones</h3>
      <ul className={styles.list}>
        {filmingDrones.map((drone) => (
          <li className={styles.item} key={drone.id}>
            <img className={styles.droneImage} src={drone.imageUrl} alt={drone.name} />
            <p className={styles.itemMeta}>
              {drone.name} - {drone.cameraQuality} - ${drone.pricePerDay}/day
            </p>
            <div className={styles.row}>
              <label className={styles.label}>
                Days:
              </label>
              <input
                className={styles.daysInput}
                min={1}
                max={30}
                type='number'
                value={getDays(drone.id)}
                onChange={(event) => updateDays(drone.id, event.target.value)}
              />
              <button className={styles.button} onClick={() => onAddDrone(drone, getDays(drone.id))} type='button'>Add to cart</button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className={styles.category}>Cargo Drones</h3>
      <ul className={styles.list}>
        {cargoDrones.map((drone) => (
          <li className={styles.item} key={drone.id}>
            <img className={styles.droneImage} src={drone.imageUrl} alt={drone.name} />
            <p className={styles.itemMeta}>
              {drone.name} - {drone.loadCapacityKg}kg load capacity - ${drone.pricePerDay}/day
            </p>
            <div className={styles.row}>
              <label className={styles.label}>
                Days:
              </label>
              <input
                className={styles.daysInput}
                min={1}
                max={30}
                type='number'
                value={getDays(drone.id)}
                onChange={(event) => updateDays(drone.id, event.target.value)}
              />
              <button className={styles.button} onClick={() => onAddDrone(drone, getDays(drone.id))} type='button'>Add to cart</button>
            </div>
          </li>
        ))}
      </ul>

      <p>Selected items: {selectedCartItems.length}</p>
      {selectedCartItems.length > 0 ? (
        <ul>
          {selectedCartItems.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              {item.name} x {item.rentalDays} day - ${item.pricePerDay * item.rentalDays}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
