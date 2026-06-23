import { useState, useEffect, useRef } from 'react'

const MUSIC_URL = 'https://raw.githubusercontent.com/zyx-0715/something/5b26b80af9d268e7dc0e3f27ece6f3e699c37310/music/music.mp3'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [musicBlob, setMusicBlob] = useState(null)
  const [loadStatus, setLoadStatus] = useState('初始化中...')
  const [audioState, setAudioState] = useState('未載入')

  // 下載音樂檔案
  useEffect(() => {
    const fetchMusic = async () => {
      console.log('🔍 開始下載音樂...')
      console.log('URL:', MUSIC_URL)
      setLoadStatus('下載中...')

      try {
        console.log('📡 發送 fetch 請求...')
        const response = await fetch(MUSIC_URL)
        
        console.log('📊 Response 狀態:', response.status)
        console.log('📊 Response 標頭:', {
          'content-type': response.headers.get('content-type'),
          'content-length': response.headers.get('content-length'),
          'cache-control': response.headers.get('cache-control'),
        })

        if (!response.ok) {
          throw new Error(`HTTP 錯誤 ${response.status}: ${response.statusText}`)
        }

        console.log('📦 開始讀取 Blob...')
        const blob = await response.blob()
        
        console.log('✅ Blob 資訊:', {
          大小: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
          類型: blob.type,
          是否為空: blob.size === 0,
        })

        if (blob.size === 0) {
          throw new Error('檔案大小為 0，檔案可能不存在或為空')
        }

        if (!blob.type.includes('audio') && !blob.type.includes('mpeg')) {
          console.warn('⚠️ 檔案類型警告:', blob.type)
        }

        console.log('🔗 生成 Blob URL...')
        const url = URL.createObjectURL(blob)
        console.log('✅ Blob URL:', url)
        
        setMusicBlob(url)
        setLoadStatus('✅ 音樂檔案已載入')
        setAudioState('已載入，等待播放')
      } catch (err) {
        console.error('❌ 下載失敗完整錯誤:', err)
        console.error('錯誤名稱:', err.name)
        console.error('錯誤訊息:', err.message)
        console.error('錯誤堆疊:', err.stack)
        setLoadStatus(`❌ 下載失敗: ${err.message}`)
      }
    }

    fetchMusic()
  }, [])

  // 監聽 audio 元素事件
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      console.log('🎵 audio: canplay 事件')
      setAudioState('可以播放')
    }
    const handlePlaying = () => {
      console.log('▶️ audio: playing 事件')
      setAudioState('正在播放')
    }
    const handlePause = () => {
      console.log('⏸️ audio: pause 事件')
      setAudioState('已暫停')
    }
    const handleEnded = () => {
      console.log('🔄 audio: ended 事件')
      setAudioState('已播放完成（自動重播）')
    }
    const handleError = (e) => {
      console.error('❌ audio: error 事件')
      console.error('錯誤代碼:', audio.error?.code)
      console.error('錯誤訊息:', audio.error?.message)
      setAudioState(`❌ 播放錯誤: ${audio.error?.message || '未知'}`)
    }
    const handleLoadStart = () => {
      console.log('⏳ audio: loadstart 事件')
    }
    const handleLoadedMetadata = () => {
      console.log('📋 audio: loadedmetadata 事件')
      console.log('時長:', audio.duration, '秒')
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  // 點擊開始播放
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || started || !musicBlob) return

    const startMusic = async () => {
      console.log('👆 使用者點擊')
      console.log('audio 元素狀態:', {
        paused: audio.paused,
        ended: audio.ended,
        duration: audio.duration,
        currentTime: audio.currentTime,
        error: audio.error?.message || 'no error',
      })

      try {
        console.log('🎚️ 設定音量為 0.5')
        audio.volume = 0.5

        console.log('▶️ 呼叫 audio.play()...')
        const promise = audio.play()

        if (promise instanceof Promise) {
          console.log('⏳ play() 返回 Promise')
          promise
            .then(() => {
              console.log('✅ Promise 解析成功 - 音樂開始播放')
              setStarted(true)
              setAudioState('✅ 正在播放')
            })
            .catch(err => {
              console.error('❌ Promise 被拒絕')
              console.error('錯誤名稱:', err.name)
              console.error('錯誤訊息:', err.message)
              setAudioState(`❌ 播放被拒: ${err.name}: ${err.message}`)
            })
        } else {
          console.log('⚠️ play() 不返回 Promise（舊瀏覽器）')
          setStarted(true)
        }
      } catch (err) {
        console.error('❌ 同步錯誤:', err)
        setAudioState(`❌ 錯誤: ${err.message}`)
      }
    }

    console.log('✅ 掛載點擊監聽器')
    window.addEventListener('click', startMusic, { once: true })
    window.addEventListener('touchstart', startMusic, { once: true })

    return () => {
      window.removeEventListener('click', startMusic)
      window.removeEventListener('touchstart', startMusic)
    }
  }, [started, musicBlob])

  return (
    <>
      <audio
        ref={audioRef}
        src={musicBlob}
        loop
      />
      {/* 除錯面板 - 只在開發時顯示 */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          background: 'rgba(0,0,0,0.8)',
          color: '#0f0',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          maxWidth: '280px',
          zIndex: 999,
          border: '1px solid #0f0',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          <div>📋 載入狀態: {loadStatus}</div>
          <div>🎵 播放狀態: {audioState}</div>
        </div>
      )}
    </>
  )
}
