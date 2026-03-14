import './App.css'
import { getIdentityData } from '@incode/identity-sdk'

function App() {
  const result = getIdentityData({
    selfieUrl: 'data:image/png;base64,mock-selfie',
    phone: '+14155552671',
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      postalCode: '94102',
    },
  })

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>SDK core contract wired.</p>
      <p>Verification status: {result.status}</p>
      <p>Verification score: {result.score}</p>
    </main>
  )
}

export default App
