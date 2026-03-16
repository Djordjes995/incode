import './App.css'
import { useMemo, useState } from 'react'
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  getIdentityData,
  type IdentityAddress,
} from '@incode/identity-sdk'

type AppStep = 'shop' | 'selfie' | 'phone' | 'address' | 'result' | 'checkout'
const appSteps: AppStep[] = ['shop', 'selfie', 'phone', 'address', 'result', 'checkout']

interface DroneItem {
  id: number
  name: string
  pricePerDay: number
}

interface CartItem extends DroneItem {
  rentalDays: number
}

const droneInventory: DroneItem[] = [
  {
    id: 1,
    name: 'Drone 1',
    pricePerDay: 100,
  },
  {
    id: 2,
    name: 'Drone 2',
    pricePerDay: 200,
  },
]

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

  const addDroneToCart = (drone: DroneItem) => {
    setSelectedCartItems((current) => [
      ...current,
      {
        ...drone,
        rentalDays: 1,
      },
    ])
  }

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.pricePerDay * item.rentalDays,
    0,
  )

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>Starter SelfieCapture + PhoneInput + AddressForm integration.</p>
      {step === 'shop' && (
        <>
          <h2>Shop</h2>
          <p>Select at least one drone to continue.</p>
          <ul>
            {droneInventory.map((drone) => (
              <li key={drone.id}>
                {drone.name} - ${drone.pricePerDay}/day{' '}
                <button onClick={() => addDroneToCart(drone)} type='button'>Add (1 day)</button>
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
        </>
      )}
      {step === 'selfie' && <>
        <SelfieCapture onChange={setSelfie} value={selfie} />
        <p>Selfie captured: {selfie ? 'yes' : 'no'}</p>
      </>}
      {step === 'phone' && <>
        <PhoneInput onChange={setNormalizedPhone} value={normalizedPhone} />
        <p>Normalized phone: {normalizedPhone || 'N/A'}</p>
      </>}
      {step === 'address' && <>
        <AddressForm onChange={setAddress} value={address ?? undefined} />
        <p>Address valid: {address ? 'yes' : 'no'}</p>
      </>}


      {step === 'result' && result ? (
        <>
          <img src={result.selfieUrl} alt='selfie' />
          <div>
            Phone: {result.phone}
          </div>
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
              <p>Verification failed. Please retry or stop checkout.</p>
              <button onClick={retryVerification} type='button'>Retry verification</button>
            </>
          ) : (
            <>
              <p>Verification succeeded. You can proceed to checkout.</p>
              <button onClick={proceedToCheckout} type='button'>Proceed to checkout</button>
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
              {selectedCartItems.map((item, index) => (
                <li key={`${item.id}-checkout-${index}`}>
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
          <button onClick={() => setRentalCompleted(true)} type='button'>Complete Rental</button>
          {rentalCompleted ? <p>Rental completed successfully.</p> : null}
        </>
      ) : null}
      <div>
        current step: {step}
      </div>
      <button onClick={goBack} disabled={step === 'shop'} type='button'>Back</button>
      {step !== 'result' && step !== 'checkout' ? (
        <button onClick={goNext} disabled={!isCurrentStepValid} type='button'>Next</button>
      ) : null}
    </main>
  )
}

export default App
