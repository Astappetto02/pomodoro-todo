import { useEffect, useState } from 'react'
import { useTimer } from 'react-timer-hook'
import useSound from 'use-sound'
import click from './assets/sounds/click.mp3'
import tickSound from './assets/sounds/tick.mp3'
import './App.css'

function Timer({ expiryTimestamp }) {
  const [playClick] = useSound(click, { volume: 0.4 })
  const [playTick, { stop: stopTick }] = useSound(tickSound, {
    loop: true,
    volume: 0.2
  })

  const [mode, setMode] = useState('pomodoro')
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const getSecondsFromMode = (m) => {
    if (m === 'short') return 300     // 5 min
    if (m === 'long') return 900      // 15 min
    return 1500                      // 25 min
  }

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => {
      playClick()

      // Pomodoro finito → pausa breve automatica
      if (mode === 'pomodoro') {
        startMode('short', true)
      }
    }
  })

  const startMode = (newMode, autoStart = true) => {
    setMode(newMode)
    const time = new Date()
    time.setSeconds(time.getSeconds() + getSecondsFromMode(newMode))
    restart(time, autoStart)
  }

  useEffect(() => {
    if (isRunning && isSoundEnabled) {
      playTick()
    } else {
      stopTick()
    }

    return () => stopTick()
  }, [isRunning, isSoundEnabled, playTick, stopTick])

  const switchMode = (newMode) => {
    startMode(newMode, false)
    playClick()
  }

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled)
    playClick()
  }

  return (
    <main className="timer-container">
      <header className="top-section">
        <h1 className="timer-title">Pomodoro Timer</h1>

        <nav className="mode-container">
          <div className="mode-buttons">
            <button
              className={`timer-button mode-button ${mode === 'pomodoro' ? 'selected' : ''}`}
              onClick={() => switchMode('pomodoro')}
            >
              Pomodoro
            </button>

            <button
              className={`timer-button mode-button ${mode === 'short' ? 'selected' : ''}`}
              onClick={() => switchMode('short')}
            >
              Short Break
            </button>

            <button
              className={`timer-button mode-button ${mode === 'long' ? 'selected' : ''}`}
              onClick={() => switchMode('long')}
            >
              Long Break
            </button>
          </div>

          <button className="sound-toggle-button" onClick={toggleSound}>
            {isSoundEnabled ? '🔊' : '🔇'}
          </button>
        </nav>
      </header>

      <section className="center-section">
        <div className="timer-display">
          <span>{String(minutes).padStart(2, '0')}</span>:
          <span>{String(seconds).padStart(2, '0')}</span>
        </div>

        <div className="button-container">
          <button
            className={`timer-button ${isRunning ? 'running' : ''}`}
            onClick={() => {
              playClick()
              isRunning ? pause() : resume()
            }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>

          <button
            className="timer-button restart-button"
            onClick={() => {
              startMode(mode, false)
              playClick()
            }}
          >
            Restart
          </button>
        </div>
      </section>

      <footer className="footer-credit">
        created by{' '}
        <a
          href="https://github.com/Astappetto02"
          target="_blank"
          rel="noopener noreferrer"
        >
          Astappetto
        </a>
      </footer>
    </main>
  )
}

function App() {
  const time = new Date()
  time.setSeconds(time.getSeconds() + 1500)

  return <Timer expiryTimestamp={time} />
}

export default App
