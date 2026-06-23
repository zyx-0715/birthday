import { useState, useEffect, useRef } from 'react'

const MUSIC_URL = 'https://raw.githubusercontent.com/zyx-0715/something/5b26b80af9d268e7dc0e3f27ece6f3e699c37310/music/music.mp3'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // 自動播放（有聲音時）
    const attemptPlay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        // 自動播放被瀏覽器阻擋，需要使用者互動才能播
        console.log('自動播放被阻擋，需要使用者點擊')
      }
    }

    // 等待 audio 載入後播放
    audio.addEventListener('canplay', attemptPlay)
    return () => audio.removeEventListener('canplay', attemptPlay)
  }, [])

  const handleToggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
      setError(false)
    } catch (err) {
      setError(true)
      console.error('播放失敗:', err)
    }
  }

  const handleError = () => {
    setError(true)
    setIsPlaying(false)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        crossOrigin="anonymous"
        onError={handleError}
        loop
      />
      <button
        className="music-btn"
        onClick={handleToggle}
        title={isPlaying ? '暫停' : '播放'}
        aria-label="音樂播放控制"
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      {error && (
        <div className="music-error" title="音樂載入失敗">
          🔕
        </div>
      )}
    </>
  )
}
