import './App.css'
import { useMemo, useState } from 'react'
import {
  AddressForm,
  PhoneInput,
  getIdentityData,
  type IdentityAddress,
} from '@incode/identity-sdk'

function App() {
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [address, setAddress] = useState<IdentityAddress | null>(null)

  const result = useMemo(() => {
    if (!normalizedPhone || !address) {
      return null
    }

    return getIdentityData({
      selfieUrl: 'data:image/png;base64,mock-selfie',
      phone: normalizedPhone,
      address,
    })
  }, [address, normalizedPhone])

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>Minimal PhoneInput + AddressForm integration.</p>
      <PhoneInput onChange={setNormalizedPhone} />
      <AddressForm onChange={setAddress} />
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
