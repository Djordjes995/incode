import { useMemo, useState } from 'react'
import { droneInventory } from './data/droneInventory'
import { ShopStep } from './components/ShopStep'
import { OrderSummary } from './components/OrderSummary'
import { StepLayout } from './components/StepLayout'
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

const APP_STEPS: { key: AppStep; label: string }[] = [
  { key: 'shop', label: 'Browse' },
  { key: 'selfie', label: 'Selfie' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'result', label: 'Result' },
  { key: 'checkout', label: 'Checkout' },
]

const NEXT_LABELS: Record<AppStep, string> = {
  shop: 'Continue to Verification',
  selfie: 'Next',
  phone: 'Next',
  address: 'Verify Identity',
  result: 'Proceed to Checkout',
  checkout: 'Complete Rental',
}

const filmingDrones = droneInventory.filter(
  (drone): drone is FilmingDroneItem => drone.category === 'filming',
)
const cargoDrones = droneInventory.filter(
  (drone): drone is CargoDroneItem => drone.category === 'cargo',
)
const MAX_RENTAL_DAYS = 30

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
    (step === 'result' && result?.status === 'verified') ||
    step === 'checkout'

  const stepKeys = APP_STEPS.map((s) => s.key)

  const goNext = () => {
    const currentIndex = stepKeys.indexOf(step)
    const nextStep = stepKeys[currentIndex + 1]
    if (nextStep) {
      setStep(nextStep)
    }
  }

  const goBack = () => {
    const currentIndex = stepKeys.indexOf(step)
    const previousStep = stepKeys[currentIndex - 1]
    if (previousStep) {
      setStep(previousStep)
    }
  }

  const retryVerification = () => {
    setSelfie('')
    setNormalizedPhone('')
    setAddress(null)
    setStep('selfie')
  }

  const addDroneToCart = (drone: DroneItem, rentalDays: number) => {
    setSelectedCartItems((current) => {
      const existingIndex = current.findIndex((item) => item.id === drone.id)
      if (existingIndex >= 0) {
        return current.map((item, index) =>
          index === existingIndex
            ? { ...item, rentalDays: Math.min(MAX_RENTAL_DAYS, item.rentalDays + rentalDays) }
            : item,
        )
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
      ]
    })
  }

  const removeCartItem = (id: number) => {
    setSelectedCartItems((current) => current.filter((item) => item.id !== id))
  }

  const updateCartItemDays = (id: number, days: number) => {
    const safeDays = Math.min(MAX_RENTAL_DAYS, Math.max(1, days))
    setSelectedCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, rentalDays: safeDays } : item)),
    )
  }

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.pricePerDay * item.rentalDays,
    0,
  )

  const showSummary = step !== 'shop'
  const showNextButton = step !== 'result' || result?.status === 'verified'
  const showBackButton = step !== 'checkout'

  const handleNext = () => {
    if (step === 'checkout') {
      setRentalCompleted(true)
      return
    }
    goNext()
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>SkyRent Drones</h1>
        <p className={styles.subtitle}>Identity verification demo with reusable SDK components.</p>
      </header>

      <div
        className={`${styles.contentLayout} ${!showSummary ? styles.contentLayoutSingle : ''}`}
      >
        <section className={styles.panel}>
          <StepLayout
            steps={APP_STEPS}
            currentStepKey={step}
            onBack={goBack}
            onNext={handleNext}
            nextLabel={NEXT_LABELS[step]}
            nextDisabled={!isCurrentStepValid}
            showBack={showBackButton}
            showNext={showNextButton}
          >
            {step === 'shop' && (
              <ShopStep
                filmingDrones={filmingDrones}
                cargoDrones={cargoDrones}
                selectedCartItems={selectedCartItems}
                onAddDrone={addDroneToCart}
                onRemoveCartItem={removeCartItem}
                onUpdateCartItemDays={updateCartItemDays}
              />
            )}

            {step === 'selfie' && (
              <div className={styles.stepSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Selfie Capture</h3>
                  <p className={styles.sectionSubtitle}>
                    Take a clear photo of your face for identity verification.
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <SelfieCapture onChange={setSelfie} value={selfie} />
                </div>
              </div>
            )}

            {step === 'phone' && (
              <div className={styles.stepSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Phone Verification</h3>
                  <p className={styles.sectionSubtitle}>
                    Enter your phone number so we can validate your contact details.
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <PhoneInput onChange={setNormalizedPhone} value={normalizedPhone} />
                </div>
              </div>
            )}

            {step === 'address' && (
              <div className={styles.stepSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Address Verification</h3>
                  <p className={styles.sectionSubtitle}>
                    Provide your current address to complete identity checks.
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <AddressForm onChange={setAddress} value={address ?? undefined} />
                </div>
              </div>
            )}

            {step === 'result' && result && (
              <div className={styles.stepSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Verification Result</h3>
                  <p className={styles.sectionSubtitle}>
                    {result.status === 'verified'
                      ? 'Your identity has been verified. You may proceed to checkout.'
                      : 'Verification failed. You can retry or abandon checkout.'}
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <div className={styles.resultGrid}>
                    <img className={styles.imagePreview} src={result.selfieUrl} alt="Captured selfie" />
                    <div className={styles.resultDetails}>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Phone</span>
                        <span>{result.phone}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Address</span>
                        <span>
                          {result.address.street}, {result.address.city}, {result.address.state},{' '}
                          {result.address.country} {result.address.postalCode}
                        </span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Score</span>
                        <span>{result.score}/100</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Status</span>
                        <span className={result.status === 'verified' ? styles.success : styles.error}>
                          {result.status === 'verified' ? 'Verified' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {result.status === 'failed' && (
                    <button className={styles.retryButton} onClick={retryVerification} type="button">
                      Retry Verification
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 'checkout' && result && (
              <div className={styles.stepSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Checkout</h3>
                  <p className={styles.sectionSubtitle}>
                    Review your order and complete the rental.
                  </p>
                </div>
                <div className={styles.sectionContent}>
                  <div className={styles.checkoutGrid}>
                    <div className={styles.checkoutSection}>
                      <h4 className={styles.checkoutHeading}>Cart</h4>
                      {selectedCartItems.length > 0 ? (
                        <ul className={styles.checkoutList}>
                          {selectedCartItems.map((item) => (
                            <li key={`${item.id}-checkout`} className={styles.checkoutItem}>
                              <span>{item.name}</span>
                              <span>{item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'}</span>
                              <span className={styles.checkoutPrice}>
                                ${item.pricePerDay * item.rentalDays}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className={styles.checkoutTotal}>
                        <span>Total</span>
                        <strong>${cartTotal}</strong>
                      </div>
                    </div>

                    <div className={styles.checkoutSection}>
                      <h4 className={styles.checkoutHeading}>Verified Identity</h4>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Status</span>
                        <span className={styles.success}>{result.status}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Phone</span>
                        <span>{result.phone}</span>
                      </div>
                      <div className={styles.resultRow}>
                        <span className={styles.resultLabel}>Address</span>
                        <span>
                          {result.address.street}, {result.address.city}, {result.address.state},{' '}
                          {result.address.country} {result.address.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {rentalCompleted && (
                    <p className={styles.success}>Rental completed successfully!</p>
                  )}
                </div>
              </div>
            )}
          </StepLayout>
        </section>

        {showSummary && (
          <OrderSummary items={selectedCartItems} total={cartTotal} />
        )}
      </div>
    </main>
  )
}

export default App
