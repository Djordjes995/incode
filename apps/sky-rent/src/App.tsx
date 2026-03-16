import { useMemo, useState } from 'react'
import { droneInventory } from './data/droneInventory'
import { ShopStep } from './components/ShopStep'
import type { CargoDroneItem, CartItem, DroneItem, FilmingDroneItem } from './components/shopTypes'
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  getIdentityData,
  type IdentityAddress,
} from '@incode/identity-sdk'
import styles from './App.module.css'

type AppStep = 'shop' | 'selfie' | 'phone' | 'address' | 'result' | 'checkout'
const appSteps: AppStep[] = ['shop', 'selfie', 'phone', 'address', 'result', 'checkout']

const filmingDrones = droneInventory.filter(
  (drone): drone is FilmingDroneItem => drone.category === 'filming',
);
const cargoDrones = droneInventory.filter(
  (drone): drone is CargoDroneItem => drone.category === 'cargo',
);
const MAX_RENTAL_DAYS = 30;

function App() {
  const [selfie, setSelfie] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [address, setAddress] = useState<IdentityAddress | null>(null)
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([])
  const [step, setStep] = useState<AppStep>('shop')
  const [rentalCompleted, setRentalCompleted] = useState(false)

  const result = useMemo(() => {
    if (!selfie || !normalizedPhone || !address) {
      return null
    }

    return getIdentityData({
      selfieUrl: selfie,
      phone: normalizedPhone,
      address,
    })
  }, [address, normalizedPhone, selfie])

  const isCurrentStepValid =
    (step === 'shop' && selectedCartItems.length > 0) ||
    (step === 'selfie' && Boolean(selfie)) ||
    (step === 'phone' && Boolean(normalizedPhone)) ||
    (step === 'address' && Boolean(address)) ||
    (step === 'result' && Boolean(result)) ||
    step === 'checkout'

  const goNext = () => {
    const currentIndex = appSteps.indexOf(step)
    const nextStep = appSteps[currentIndex + 1]
    if (nextStep) {
      setStep(nextStep)
    }
  }

  const goBack = () => {
    const currentIndex = appSteps.indexOf(step)
    const previousStep = appSteps[currentIndex - 1]
    if (previousStep) {
      setStep(previousStep)
    }
  }

  const retryVerification = () => {
    setSelfie('')
    setNormalizedPhone('')
    setAddress(null)
    setRentalCompleted(false)
    setStep('selfie')
  }

  const proceedToCheckout = () => {
    if (result?.status === 'verified') {
      setStep('checkout')
    }
  }

  const addDroneToCart = (drone: DroneItem, rentalDays: number) => {
    setSelectedCartItems((current) => {
      const existingIndex = current.findIndex((item) => item.id === drone.id);
      if (existingIndex >= 0) {
        return current.map((item, index) =>
          index === existingIndex
            ? { ...item, rentalDays: Math.min(MAX_RENTAL_DAYS, item.rentalDays + rentalDays) }
            : item,
        );
      }

      return [
        ...current,
        {
          id: drone.id,
          name: drone.name,
          description: drone.description,
          category: drone.category,
          pricePerDay: drone.pricePerDay,
          imageUrl: drone.imageUrl,
          rentalDays,
          ...(drone.category === 'cargo'
            ? { loadCapacityKg: drone.loadCapacityKg }
            : { cameraQuality: drone.cameraQuality }),
        },
      ];
    })
  }

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.pricePerDay * item.rentalDays,
    0,
  )

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>SkyRent Drones</h1>
        <p className={styles.subtitle}>Identity verification demo with reusable SDK components.</p>
      </header>

      <section className={styles.panel}>
        {step === 'shop' ? (
          <ShopStep
            filmingDrones={filmingDrones}
            cargoDrones={cargoDrones}
            selectedCartItems={selectedCartItems}
            onAddDrone={addDroneToCart}
          />
        ) : null}
        {step === 'selfie' && <>
          <SelfieCapture onChange={setSelfie} value={selfie} />
          <p className={styles.status}>Selfie captured: {selfie ? 'yes' : 'no'}</p>
        </>}
        {step === 'phone' && <>
          <PhoneInput onChange={setNormalizedPhone} value={normalizedPhone} />
          <p className={styles.status}>Normalized phone: {normalizedPhone || 'N/A'}</p>
        </>}
        {step === 'address' && <>
          <AddressForm onChange={setAddress} value={address ?? undefined} />
          <p className={styles.status}>Address valid: {address ? 'yes' : 'no'}</p>
        </>}

        {step === 'result' && result ? (
          <>
            <img className={styles.imagePreview} src={result.selfieUrl} alt='selfie' />
            <div>Phone: {result.phone}</div>
            <div>
              Address:
              <div>
                Street: {result.address.street}<br />
                City: {result.address.city}<br />
                State: {result.address.state}<br />
                Country: {result.address.country}<br />
                Postal Code: {result.address.postalCode}<br />
              </div>
            </div>
            <p>Verification status: {result.status}</p>
            <p>Verification score: {result.score}</p>
            {result.status === 'failed' ? (
              <>
                <p className={styles.error}>Verification failed. Please retry or stop checkout.</p>
                <button className={styles.button} onClick={retryVerification} type='button'>Retry verification</button>
              </>
            ) : (
              <>
                <p className={styles.success}>Verification succeeded. You can proceed to checkout.</p>
                <button className={styles.primaryButton} onClick={proceedToCheckout} type='button'>Proceed to checkout</button>
              </>
            )}
          </>
        ) : null}
        {step === 'checkout' && result ? (
          <>
            <h2>Checkout</h2>
            <p>Cart items: {selectedCartItems.length}</p>
            {selectedCartItems.length > 0 ? (
              <ul>
                {selectedCartItems.map((item) => (
                  <li key={`${item.id}-checkout`}>
                    {item.name} x {item.rentalDays} day - ${item.pricePerDay * item.rentalDays}
                  </li>
                ))}
              </ul>
            ) : null}
            <p>Total: ${cartTotal}</p>
            <p>Identity status: {result.status}</p>
            <p>Phone: {result.phone}</p>
            <p>
              Address: {result.address.street}, {result.address.city}, {result.address.state},{' '}
              {result.address.country}, {result.address.postalCode}
            </p>
            <button className={styles.primaryButton} onClick={() => setRentalCompleted(true)} type='button'>Complete Rental</button>
            {rentalCompleted ? <p className={styles.success}>Rental completed successfully.</p> : null}
          </>
        ) : null}
      </section>

      <p className={styles.status}>Current step: {step}</p>

      <div className={styles.actions}>
        <button className={styles.button} onClick={goBack} disabled={step === 'shop'} type='button'>Back</button>
        {step !== 'result' && step !== 'checkout' ? (
          <button className={styles.primaryButton} onClick={goNext} disabled={!isCurrentStepValid} type='button'>Next</button>
        ) : null}
      </div>
    </main>
  )
}

export default App
