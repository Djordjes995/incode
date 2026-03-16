import './App.css'
import { useMemo, useState } from 'react'
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  getIdentityData,
  type IdentityAddress,
} from '@incode/identity-sdk'

type VerificationStep = 'selfie' | 'phone' | 'address' | 'result'
const verificationSteps: VerificationStep[] = ['selfie', 'phone', 'address', 'result']

function App() {
  const [selfie, setSelfie] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [address, setAddress] = useState<IdentityAddress | null>(null)
  const [step, setStep] = useState<VerificationStep>('selfie')

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
    (step === 'selfie' && Boolean(selfie)) ||
    (step === 'phone' && Boolean(normalizedPhone)) ||
    (step === 'address' && Boolean(address)) ||
    (step === 'result' && Boolean(result))

  const goNext = () => {
    const currentIndex = verificationSteps.indexOf(step)
    const nextStep = verificationSteps[currentIndex + 1]
    if (nextStep) {
      setStep(nextStep)
    }
  }

  const goBack = () => {
    const currentIndex = verificationSteps.indexOf(step)
    const previousStep = verificationSteps[currentIndex - 1]
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

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>Starter SelfieCapture + PhoneInput + AddressForm integration.</p>
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
            <p>Verification succeeded. You can proceed to checkout.</p>
          )}
        </>
      ) : null}
      <div>
        current step: {step}
      </div>
      <button onClick={goBack} disabled={step === 'selfie'} type='button'>Back</button>
      {
        step !== 'result' && <button onClick={goNext} disabled={!isCurrentStepValid} type='button'>Next</button>
      }
    </main>
  )
}

export default App
