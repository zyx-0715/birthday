import { useState, useEffect, useRef } from 'react'
import { getTimeUntilBirthday } from '../utils/timeUtils'

function CountdownUnit({ value, label, color }) {
  const display = String(value).padStart(2, '0')
  const prevRef  = useRef(display)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (display !== prevRef.current) {
      prevRef.current = display
      setKey(k => k + 1)
    }
  }, [display])

  return (
    <div className="cu-card">
      <div className="cu-inner">
        <div key={key} className="cu-num" style={{ color }}>
          {display}
        </div>
        <div className="cu-glow" style={{ background: color }} />
      </div>
      <div className="cu-label">{label}</div>
    </div>
  )
}

export default function CountdownScreen() {
  const [time, setTime] = useState(getTimeUntilBirthday())

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeUntilBirthday()
      setTime(t)
      if (t.done) {
        clearInterval(id)
        // Reload to show the card
        window.location.reload()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="screen cd-screen">
      <div className="cd-content">

        {/* Top decoration */}
        <div className="cd-deco">
          <span className="cd-star s1">✦</span>
          <span className="cd-star s2">✦</span>
          <span className="cd-star s3">✦</span>
        </div>

        {/* Title */}
        <div className="cd-title-wrap">
          <span className="cd-emoji">🎂</span>
          <h1 className="cd-title">
            <span className="cd-name">ZYX</span>
            <span className="cd-title-sub">的生日</span>
          </h1>
          <span className="cd-emoji">🎂</span>
        </div>

        <p className="cd-sub">距離生日還有……</p>

        {/* Countdown grid */}
        <div className="cd-grid">
          <CountdownUnit value={time.days}    label="日" color="#06b6d4" />
          <div className="cd-sep">:</div>
          <CountdownUnit value={time.hours}   label="時" color="#a855f7" />
          <div className="cd-sep">:</div>
          <CountdownUnit value={time.minutes} label="分" color="#ec4899" />
          <div className="cd-sep">:</div>
          <CountdownUnit value={time.seconds} label="秒" color="#fbbf24" />
        </div>

        {/* Glass info card */}
        <div className="cd-info-card">
          <div className="cd-info-row">
            <span className="cd-info-dot" style={{ background: '#a855f7' }} />
            <span>生日日期</span>
            <span className="cd-info-val">2026 年 7 月 15 日</span>
          </div>
          <div className="cd-info-row">
            <span className="cd-info-dot" style={{ background: '#ec4899' }} />
            <span>特別送給</span>
            <span className="cd-info-val">ZYX 🎀</span>
          </div>
          <div className="cd-info-row">
            <span className="cd-info-dot" style={{ background: '#fbbf24' }} />
            <span>來　　自</span>
            <span className="cd-info-val">李光祁 💙</span>
          </div>
        </div>

        <p className="cd-note">當天 00:00（台北時間）卡片將自動開啟 ✨</p>

        {/* Bottom deco */}
        <div className="cd-deco cd-deco-bot">
          <span className="cd-star s4">✦</span>
          <span className="cd-star s5">✦</span>
          <span className="cd-star s6">✦</span>
        </div>
      </div>
    </div>
  )
}
