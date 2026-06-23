import { useState, useRef, useEffect } from 'react'

const PASSWORD = 'ZYX_hbd_password'

export default function PasswordScreen({ onSuccess }) {
  const [value, setValue]     = useState('')
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState(false)
  const [shaking, setShaking] = useState(false)
  const [entering, setEntering] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 600)
  }, [])

  const handleSubmit = () => {
    if (entering) return
    if (value === PASSWORD) {
      setEntering(true)
      onSuccess()
    } else {
      setError(true)
      setShaking(true)
      setValue('')
      setTimeout(() => setShaking(false), 550)
      setTimeout(() => setError(false), 2800)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="screen">
      <div className={`pw-wrap ${shaking ? 'pw-shake' : ''}`}>
        {/* Animated gradient border wrapper */}
        <div className="pw-border-wrap">
          <div className="pw-card">

            {/* Lock icon */}
            <div className="pw-lock-ring">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="3"
                  fill="rgba(168,85,247,0.18)" stroke="url(#lg1)" strokeWidth="1.8"/>
                <path d="M7 11V7a5 5 0 0110 0v4"
                  stroke="url(#lg2)" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="16.5" r="1.6" fill="#fbbf24"/>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                  <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1 className="pw-title">私密空間</h1>
            <p className="pw-sub">請輸入密碼以進入</p>

            {/* Input */}
            <div className={`pw-input-wrap ${error ? 'pw-input-err' : ''}`}>
              <svg className="pw-input-icon" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKey}
                placeholder="輸入密碼"
                className="pw-input"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="pw-eye"
                type="button"
                onClick={() => setShow(s => !s)}
                aria-label={show ? '隱藏密碼' : '顯示密碼'}
              >
                {show ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
                      a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0
                      11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Error message */}
            <div className={`pw-error ${error ? 'pw-error-show' : ''}`}>
              ✗ 密碼錯誤，請再試一次
            </div>

            {/* Submit */}
            <button className="pw-submit" onClick={handleSubmit} disabled={entering}>
              <span>進　入</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <p className="pw-hint">🔒 這是一個私人空間</p>
          </div>
        </div>
      </div>
    </div>
  )
}
