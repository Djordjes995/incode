import './App.css'
import { useMemo, useState } from 'react'
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  getIdentityData,
  type IdentityAddress,
} from '@incode/identity-sdk'

function App() {
  const [selfie, setSelfie] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [address, setAddress] = useState<IdentityAddress | null>(null)
  const [step, setStep] = useState<'selfie' | 'phone' | 'address' | 'result'>('selfie')

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

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>Starter SelfieCapture + PhoneInput + AddressForm integration.</p>
      {step === 'selfie' && <>
        <SelfieCapture onChange={setSelfie} />
        <p>Selfie captured: {selfie ? 'yes' : 'no'}</p>
        <button onClick={() => setStep('phone')} disabled={!selfie}>Next</button>
      </>}
      {step === 'phone' && <>
        <PhoneInput onChange={setNormalizedPhone} />
        <p>Normalized phone: {normalizedPhone || 'N/A'}</p>
        <button onClick={() => setStep('address')} disabled={!normalizedPhone}>Next</button>
      </>}
      {step === 'address' && <>
        <AddressForm onChange={setAddress} />
        <p>Address valid: {address ? 'yes' : 'no'}</p>
        <button onClick={() => setStep('result')} disabled={!address}>Next</button>
      </>}


      {step === 'result' && result ? (
        <>
          <p>Verification status: {result.status}</p>
          <p>Verification score: {result.score}</p>
        </>
      ) : null}
    </main>
  )
}

export default App
