import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [target, setTarget] = useState({ x: 50, y: 50, size: 76 })
  const [isRunning, setIsRunning] = useState(false)

  const moveTarget = () => {
    setTarget({
      x: 12 + Math.random() * 76,
      y: 14 + Math.random() * 68,
      size: 58 + Math.random() * 28,
    })
  }

  const startGame = () => {
    setScore(0)
    setMisses(0)
    setCombo(0)
    setTimeLeft(30)
    setIsRunning(true)
    moveTarget()
  }

  const hitTarget = (event) => {
    event.stopPropagation()
    if (!isRunning) return
    setScore((currentScore) => currentScore + 100 + combo * 25)
    setCombo((currentCombo) => currentCombo + 1)
    moveTarget()
  }

  const missTarget = () => {
    if (!isRunning) return
    setMisses((currentMisses) => currentMisses + 1)
    setCombo(0)
  }

  useEffect(() => {
    if (!isRunning) return undefined

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsRunning(false)
          return 0
        }
        return currentTime - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">SS</div>
        <div>
          <p className="eyebrow">Arcade protocol / 07</p>
          <h1>Signal Sprint</h1>
        </div>
        <button className="reset-button" type="button" onClick={startGame}>
          {isRunning ? 'Restart run' : 'Start run'}
        </button>
      </header>

      <section className="scoreboard" aria-label="Game statistics">
        <div className="stat stat-primary"><span>Score</span><strong>{String(score).padStart(5, '0')}</strong></div>
        <div className="stat"><span>Combo</span><strong>{String(combo).padStart(2, '0')}x</strong></div>
        <div className="stat"><span>Misses</span><strong>{String(misses).padStart(2, '0')}</strong></div>
        <div className="stat stat-time"><span>Time</span><strong>00:{String(timeLeft).padStart(2, '0')}</strong></div>
      </section>

      <section className="game-stage" onClick={missTarget} aria-label="Game arena">
        <div className="stage-grid" aria-hidden="true" />
        {!isRunning && timeLeft === 0 && <p className="game-over">Run complete. Final score: {score}</p>}
        {!isRunning && timeLeft > 0 && <p className="game-prompt">Click the signal to begin</p>}
        <button
          type="button"
          className={`target ${isRunning ? 'target-active' : ''}`}
          style={{ left: `${target.x}%`, top: `${target.y}%`, width: target.size, height: target.size }}
          onClick={hitTarget}
          aria-label="Signal target"
        >
          <span />
        </button>
        <div className="stage-label">LIVE FIELD <span>●</span></div>
        <div className="stage-coordinate">X {Math.round(target.x)} / Y {Math.round(target.y)}</div>
      </section>

      <footer className="footer-note">
        <span>Hit the moving signal</span>
        <span>+100 base / +25 per combo</span>
      </footer>
    </main>
  )
}

export default App
