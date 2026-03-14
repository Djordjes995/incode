import './App.css'
import { useIdentitySdkReady } from '@incode/identity-sdk'

function App() {
  const sdkReady = useIdentitySdkReady()

  return (
    <main className="app">
      <h1>SkyRent Drones</h1>
      <p>Workspace foundation is ready.</p>
      <p>SDK linked: {sdkReady ? 'yes' : 'no'}</p>
    </main>
  )
}

export default App
