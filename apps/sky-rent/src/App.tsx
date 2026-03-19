import { useState } from 'react'
import { droneInventory } from './data/droneInventory'
import { ShopStep } from './components/ShopStep'
import { OrderSummary } from './components/OrderSummary'
import { StepLayout } from './components/StepLayout'
import { ResultStep } from './components/ResultStep'
import { CheckoutStep } from './components/CheckoutStep'
import type { CargoDroneItem, CartItem, DroneItem, FilmingDroneItem } from './components/shopTypes'
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  getIdentityData,
  type IdentityAddress,
  type IdentityResult,
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
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [address, setAddress] = useState<IdentityAddress | null>(null)
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([])
  const [step, setStep] = useState<AppStep>('shop')
  const [rentalCompleted, setRentalCompleted] = useState(false)
  const [verificationAttempt, setVerificationAttempt] = useState(0)
  const [result, setResult] = useState<IdentityResult | null>(null)

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
    setPhoneDisplay('')
    setNormalizedPhone('')
    setAddress(null)
    setResult(null)
    setVerificationAttempt((v) => v + 1)
    setStep('selfie')
  }

  const resetFlow = () => {
    setSelfie('')
    setPhoneDisplay('')
    setNormalizedPhone('')
    setAddress(null)
    setSelectedCartItems([])
    setResult(null)
    setRentalCompleted(false)
    setVerificationAttempt((v) => v + 1)
    setStep('shop')
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

  const showSummary = step !== 'shop' && step !== 'checkout'
  const showNextButton = step !== 'result' || result?.status === 'verified'
  const showBackButton = step !== 'checkout' && step !== 'shop'
  const nextLabel = step === 'checkout' && rentalCompleted ? 'Start New Rental' : NEXT_LABELS[step]

  const handleNext = () => {
    if (step === 'checkout') {
      if (rentalCompleted) {
        resetFlow()
        return
      }
      setRentalCompleted(true)
      return
    }
    if (step === 'address') {
      if (!selfie || !normalizedPhone || !address) return
      const verification = getIdentityData({
        selfieUrl: selfie,
        phone: normalizedPhone,
        address,
      })
      setResult(verification)
      setStep('result')
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
            nextLabel={nextLabel}
            nextDisabled={!isCurrentStepValid}
            showBack={showBackButton}
            showNext={showNextButton}
          >
            {step === 'shop' && (
              <ShopStep
                onGoNext={goNext}
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
                  <SelfieCapture
                    key={`selfie-${verificationAttempt}`}
                    onChange={(next) => setSelfie(next.base64 ?? '')}
                    defaultValue={selfie}
                  />
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
                  <PhoneInput
                    key={`phone-${verificationAttempt}`}
                    onChange={(next) => {
                      setPhoneDisplay(next.display)
                      setNormalizedPhone(next.normalized ?? '')
                    }}
                    defaultValue={phoneDisplay}
                  />
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
                  <AddressForm
                    key={`address-${verificationAttempt}`}
                    onChange={(next) => setAddress(next.isValid ? next.trimmed : null)}
                    defaultValue={address ?? undefined}
                  />
                </div>
              </div>
            )}

            {step === 'result' && result && (
              <ResultStep result={result} onRetry={retryVerification} />
            )}

            {step === 'checkout' && result && (
              <CheckoutStep
                result={result}
                selectedCartItems={selectedCartItems}
                cartTotal={cartTotal}
                rentalCompleted={rentalCompleted}
              />
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
