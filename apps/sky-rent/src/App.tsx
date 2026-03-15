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
      <SelfieCapture onChange={setSelfie} />
      <PhoneInput onChange={setNormalizedPhone} />
      <AddressForm onChange={setAddress} />
      <p>Selfie captured: {selfie ? 'yes' : 'no'}</p>
      <p>Normalized phone: {normalizedPhone || 'N/A'}</p>
      <p>Address valid: {address ? 'yes' : 'no'}</p>
      {result ? (
        <>
          <p>Verification status: {result.status}</p>
          <p>Verification score: {result.score}</p>
        </>
      ) : null}
    </main>
  )
}

export default App
