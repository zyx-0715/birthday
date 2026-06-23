import { useEffect, useRef } from 'react'

const BRAND = [
  '#a855f7', '#ec4899', '#06b6d4', '#fbbf24',
  '#0369a1', '#7c3aed', '#e879f9', '#38bdf8', '#f472b6',
]

export default function ParticleCanvas({ birthday = false }) {
  const canvasRef = useRef(null)
  const birthdayRef = useRef(birthday)

  useEffect(() => {
    birthdayRef.current = birthday
  }, [birthday])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId
    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Stars ──────────────────────────────────────────────────────────────
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(),
      spd: Math.random() * 0.007 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
    }))

    // ── Floating particles ──────────────────────────────────────────────────
    const mkP = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.5 + 0.5,
      color: BRAND[Math.floor(Math.random() * BRAND.length)],
      a: Math.random() * 0.45 + 0.08,
      aspd: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      glow: Math.random() * 18 + 6,
    })

    // ── Geometric shapes (diamonds / rings) ────────────────────────────────
    const mkGeo = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 18 + 6,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.008,
      color: BRAND[Math.floor(Math.random() * BRAND.length)],
      a: Math.random() * 0.12 + 0.03,
      type: Math.random() > 0.5 ? 'diamond' : 'ring',
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    })

    const particles = Array.from({ length: 100 }, mkP)
    const geos = Array.from({ length: 20 }, mkGeo)

    // ── Confetti (birthday mode) ────────────────────────────────────────────
    const mkC = (fromTop = false) => ({
      x: Math.random() * W,
      y: fromTop ? Math.random() * -120 : Math.random() * H,
      vx: (Math.random() - 0.5) * 2.2,
      vy: Math.random() * 2.8 + 0.6,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.14,
      w: Math.random() * 10 + 4,
      h: Math.random() * 5 + 3,
      color: BRAND[Math.floor(Math.random() * BRAND.length)],
      shape: ['rect', 'circle', 'star'][Math.floor(Math.random() * 3)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpd: Math.random() * 0.05 + 0.02,
    })

    const confetti = birthday ? Array.from({ length: 90 }, () => mkC(false)) : []

    // ── Draw star shape helper ──────────────────────────────────────────────
    const drawStar = (cx, cy, r, points = 5) => {
      ctx.beginPath()
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2
        const rad = i % 2 === 0 ? r : r * 0.45
        if (i === 0) ctx.moveTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
        else ctx.lineTo(cx + rad * Math.cos(angle), cy + rad * Math.sin(angle))
      }
      ctx.closePath()
    }

    // ── Main render loop ────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Background deep gradient (subtle)
      const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.8)
      bgGrad.addColorStop(0, 'rgba(30,58,138,0.18)')
      bgGrad.addColorStop(0.5, 'rgba(15,23,42,0.05)')
      bgGrad.addColorStop(1, 'rgba(3,7,18,0)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Stars
      stars.forEach(s => {
        s.a += s.spd * s.dir
        if (s.a >= 0.88 || s.a <= 0.04) s.dir *= -1
        ctx.save()
        ctx.globalAlpha = s.a * 0.65
        ctx.fillStyle = '#f8fafc'
        ctx.shadowColor = '#c7d2fe'
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Geometric shapes
      geos.forEach(g => {
        g.rot += g.rotSpd
        g.x += g.vx
        g.y += g.vy
        if (g.x < -50) g.x = W + 50
        if (g.x > W + 50) g.x = -50
        if (g.y < -50) g.y = H + 50
        if (g.y > H + 50) g.y = -50
        ctx.save()
        ctx.translate(g.x, g.y)
        ctx.rotate(g.rot)
        ctx.globalAlpha = g.a
        ctx.strokeStyle = g.color
        ctx.shadowColor = g.color
        ctx.shadowBlur = 12
        ctx.lineWidth = 1.2
        if (g.type === 'diamond') {
          ctx.beginPath()
          ctx.moveTo(0, -g.size)
          ctx.lineTo(g.size * 0.6, 0)
          ctx.lineTo(0, g.size)
          ctx.lineTo(-g.size * 0.6, 0)
          ctx.closePath()
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, g.size, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      })

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = dx * dx + dy * dy
          if (dist < 9000) { // 95px
            ctx.save()
            ctx.globalAlpha = (1 - dist / 9000) * 0.1
            ctx.strokeStyle = '#a855f7'
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.a += p.aspd
        if (p.a < 0.06) p.aspd = Math.abs(p.aspd)
        if (p.a > 0.6)  p.aspd = -Math.abs(p.aspd)
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.save()
        ctx.globalAlpha = p.a
        ctx.shadowColor = p.color
        ctx.shadowBlur = p.glow
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Confetti
      if (birthdayRef.current) {
        confetti.forEach(c => {
          c.x += c.vx + Math.sin(c.wobble) * 0.5
          c.y += c.vy
          c.rot += c.rotSpd
          c.wobble += c.wobbleSpd
          if (c.y > H + 30) Object.assign(c, mkC(true))

          ctx.save()
          ctx.translate(c.x, c.y)
          ctx.rotate(c.rot)
          ctx.globalAlpha = 0.88
          ctx.fillStyle = c.color
          ctx.shadowColor = c.color
          ctx.shadowBlur = 10

          if (c.shape === 'rect') {
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h)
          } else if (c.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, c.w / 2.5, 0, Math.PI * 2)
            ctx.fill()
          } else {
            drawStar(0, 0, c.w / 2, 5)
            ctx.fill()
          }
          ctx.restore()
        })
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, []) // only run once; birthday mode handled via ref

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
