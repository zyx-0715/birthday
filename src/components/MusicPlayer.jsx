import { useState, useEffect, useRef } from 'react'

const MUSIC_URL = 'https://raw.githubusercontent.com/zyx-0715/something/5b26b80af9d268e7dc0e3f27ece6f3e699c37310/music/music.mp3'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || started) return

    // 監聽任何使用者互動（點擊、觸碰等）
    const startMusic = async () => {
      try {
        audio.volume = 0.5  // 設定音量 50%
        await audio.play()
        setStarted(true)
      } catch (err) {
        console.log('播放失敗:', err)
      }
    }

    // 監聽使用者點擊
    window.addEventListener('click', startMusic, { once: true })
    window.addEventListener('touchstart', startMusic, { once: true })

    return () => {
      window.removeEventListener('click', startMusic)
      window.removeEventListener('touchstart', startMusic)
    }
  }, [started])

  return (
    <audio
      ref={audioRef}
      src={MUSIC_URL}
      crossOrigin="anonymous"
      loop
    />
  )
}
