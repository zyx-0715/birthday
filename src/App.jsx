import { useState, useEffect } from 'react'
import ParticleCanvas from './components/ParticleCanvas'
import PasswordScreen from './components/PasswordScreen'
import CountdownScreen from './components/CountdownScreen'
import CardScreen from './components/CardScreen'
import { isBirthdayOrAfter } from './utils/timeUtils'

export default function App() {
  const [authed, setAuthed]   = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady]     = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('zyx_auth')
    if (saved === 'true') setAuthed(true)
    setUnlocked(isBirthdayOrAfter())
    setReady(true)
  }, [])

  const handleAuth = () => {
    localStorage.setItem('zyx_auth', 'true')
    setAuthed(true)
  }

  if (!ready) return null

  const showCard = authed && unlocked

  return (
    <>
      <ParticleCanvas birthday={showCard} />
      {!authed && <PasswordScreen onSuccess={handleAuth} />}
      {authed && !unlocked && <CountdownScreen />}
      {showCard && <CardScreen />}
    </>
  )
}
