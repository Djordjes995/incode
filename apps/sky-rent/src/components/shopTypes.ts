export interface BaseDroneItem {
  id: number
  name: string
  description: string
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
