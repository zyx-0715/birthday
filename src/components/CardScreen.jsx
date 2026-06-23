import { useState, useEffect, useRef } from 'react'

/** 卡片文字段落 */
const SEGS = [
  { id: 0, type: 'greeting', text: 'ZYX：' },
  { id: 1, type: 'para',     text: '生日快樂！今天妳就 12 歲了！🎂' },
  { id: 2, type: 'para',     text: '我們認識也滿久了。很開心這一年有妳的陪伴，雖然每天在學校的生活好像都差不多，就是上課、下課、補習，但因為有妳在，每天去學校都變成一件讓人期待的事。' },
  { id: 3, type: 'para',     text: '幾個月後，我們就都要升上國中了。希望我能夠跟妳同班，度過接下來的國中三年。祝妳在 12 歲的每一天都能過得開心，不管遇到什麼事，妳寶貝都陪著妳（應該吧。' },
  { id: 4, type: 'sig',      text: '妳寶貝 李光祁' },
  { id: 5, type: 'aside',    text: '（妳怎麼寫那麼長的' },
]

/** 每段打完後的停頓 ms */
const PAUSE = { greeting: 600, para: 380, sig: 900, aside: 0 }
/** 每個字的間隔 ms */
const SPEED = 42

export default function CardScreen() {
  const [curSeg,  setCurSeg]  = useState(0)   // 正在打字的段落 index
  const [curChar, setCurChar] = useState(0)   // 目前已打出的字數
  const [done,    setDone]    = useState([])  // 已完成段落的 index 陣列
  const [finished, setFinished] = useState(false)
  const bottomRef = useRef(null)

  // 打字機主邏輯
  useEffect(() => {
    if (finished) return
    if (curSeg >= SEGS.length) { setFinished(true); return }

    const seg = SEGS[curSeg]

    if (curChar < seg.text.length) {
      const t = setTimeout(() => setCurChar(c => c + 1), SPEED)
      return () => clearTimeout(t)
    } else {
      // 這段打完 → 停頓後推進下一段
      const t = setTimeout(() => {
        setDone(d => [...d, curSeg])
        setCurSeg(s => s + 1)
        setCurChar(0)
      }, PAUSE[seg.type] ?? 350)
      return () => clearTimeout(t)
    }
  }, [curSeg, curChar, finished])

  // 自動捲到最底
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [curChar, curSeg])

  return (
    <div className="screen card-screen">
      <div className="card-wrap">

        {/* ── 頁首 ── */}
        <div className="card-header">
          <div className="card-header-row">
            <span className="card-emoji">🎂</span>
            <h1 className="card-main-title">
              <span className="gtext">生日快樂</span>
            </h1>
            <span className="card-emoji">🎂</span>
          </div>
          <p className="card-main-sub">
            <span className="gtext-cyan">Happy&nbsp;</span>
            <span className="gtext-pink">12th&nbsp;</span>
            <span className="gtext-gold">Birthday</span>
          </p>
        </div>

        {/* ── 信封卡片 ── */}
        <div className="letter-border">
          <div className="letter-card">

            {/* 卡片頂部裝飾線 */}
            <div className="letter-top-bar" />

            {/* 文字區 */}
            <div className="letter-body">
              {SEGS.map((seg, i) => {
                const isVisible = i <= curSeg
                if (!isVisible) return null

                const isDone    = done.includes(i)
                const isCurrent = i === curSeg
                const text      = isDone ? seg.text : seg.text.slice(0, curChar)
                const showCursor = isCurrent && !finished

                return (
                  <div key={seg.id} className={`seg seg-${seg.type}`}>
                    {seg.type === 'sig' ? (
                      <span className="seg-sig-text">
                        {text}
                        {showCursor && <span className="cursor">｜</span>}
                      </span>
                    ) : (
                      <>
                        {text}
                        {showCursor && <span className="cursor">｜</span>}
                      </>
                    )}
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* 完成後的愛心裝飾 */}
            {finished && (
              <div className="letter-footer">
                <span className="letter-heart">💙</span>
                <span className="letter-heart">💜</span>
                <span className="letter-heart">💗</span>
              </div>
            )}
          </div>
        </div>

        {/* ── 完成後的慶祝區塊 ── */}
        {finished && (
          <div className="celebrate-row">
            <span className="cel">🎉</span>
            <span className="cel cel2">✨</span>
            <span className="cel cel3">🎈</span>
            <span className="cel cel4">✨</span>
            <span className="cel">🎉</span>
          </div>
        )}

        {/* ── 頁尾 ── */}
        <div className="card-footer-note">
          <span>從 李光祁 送給 ZYX 的生日禮物</span>
          <span className="footer-dot">·</span>
          <span>2026.07.15</span>
        </div>

      </div>
    </div>
  )
}
