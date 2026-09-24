import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ImageEditor from '@unlayer/react-image-editor'
import { MISSIONS } from './data/missions.js'
import './App.css'

const MENU_OPTIONS = [
  { id: 'start', label: 'START GAME' },
  { id: 'photo', label: 'PHOTO MODE' },
  { id: 'newsroom', label: 'NEWSROOM' },
  { id: 'contacts', label: 'CONTACTS' },
  { id: 'options', label: 'OPTIONS' },
  { id: 'credits', label: 'CREDITS' },
  { id: 'quit', label: 'QUIT' },
]

const BOOT_LINES = [
  'INITIALIZING...',
  'CITY NETWORK      ONLINE',
  'CAMERA GRID       ONLINE',
  'NEWSROOM          ONLINE',
  'ARCHIVE           ONLINE',
]

const emptySession = {
  missionId: null,
  sourceImage: null,
  actions: [],
  editedImage: null,
  submitted: false,
}

function createOptions(tools) {
  return {
    theme: 'dark',
    features: {
      imageEditor: {
        dock: 'left',
        tools,
      },
    },
  }
}

function useGameAudio() {
  const audioRef = useRef(null)
  const ambientRef = useRef(null)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return null
      audioRef.current = new AudioContext()
    }
    return audioRef.current
  }, [])

  const startAmbient = useCallback(() => {
    const audio = getAudio()
    if (!audio || ambientRef.current) return

    const hum = audio.createOscillator()
    const shimmer = audio.createOscillator()
    const gain = audio.createGain()
    hum.type = 'sawtooth'
    shimmer.type = 'sine'
    hum.frequency.value = 54
    shimmer.frequency.value = 91
    gain.gain.value = 0.018
    hum.connect(gain)
    shimmer.connect(gain)
    gain.connect(audio.destination)
    hum.start()
    shimmer.start()
    ambientRef.current = { hum, shimmer, gain }
  }, [getAudio])

  const tone = useCallback(
    (frequency, duration = 0.08, volume = 0.045) => {
      const audio = getAudio()
      if (!audio) return
      if (audio.state === 'suspended') audio.resume()
      startAmbient()

      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = 'triangle'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(volume, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.start()
      osc.stop(audio.currentTime + duration)
    },
    [getAudio, startAmbient],
  )

  return {
    hover: () => tone(360, 0.04, 0.018),
    select: () => tone(620, 0.075, 0.04),
    success: () => {
      tone(520, 0.08, 0.04)
      window.setTimeout(() => tone(780, 0.1, 0.04), 90)
    },
  }
}

function App() {
  const [screen, setScreen] = useState('boot')
  const [bootComplete, setBootComplete] = useState(false)
  const [menuIndex, setMenuIndex] = useState(0)
  const [missionIndex, setMissionIndex] = useState(0)
  const [completed, setCompleted] = useState([])
  const [session, setSession] = useState(emptySession)
  const [cash, setCash] = useState(1480)
  const [rep, setRep] = useState(2)
  const [statusLine, setStatusLine] = useState('RAW FEED READY')
  const editorRef = useRef(null)
  const audio = useGameAudio()

  const activeMission = MISSIONS[missionIndex]
  const newsroomItems = completed.slice().reverse()
  const contacts = ['R. ARCHER', ...completed.map((item) => item.unlock)]
  const completedIds = useMemo(() => new Set(completed.map((item) => item.id)), [completed])
  const score = cash + rep * 25 + completed.length * 500

  const openMission = useCallback((mission) => {
    setStatusLine('OPENING RAW CAPTURE...')
    setSession({
      missionId: mission.id,
      sourceImage: mission.image,
      actions: [],
      editedImage: null,
      submitted: false,
    })
    window.setTimeout(() => {
      setStatusLine('LOADING FRAME...')
      setScreen('editor')
    }, 520)
  }, [])

  const pickMenu = useCallback(
    (id) => {
      audio.select()
      if (id === 'start') setScreen('missions')
      if (id === 'photo') openMission(activeMission)
      if (id === 'newsroom') setScreen('newsroom')
      if (id === 'contacts') setScreen('contacts')
      if (id === 'options') setScreen('options')
      if (id === 'credits') setScreen('credits')
      if (id === 'quit') setScreen('boot')
    },
    [activeMission, audio, openMission],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setBootComplete(true), 3600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (screen === 'boot' && bootComplete && event.key === 'Enter') {
        audio.select()
        setScreen('menu')
      }

      if (screen !== 'menu') return

      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault()
        audio.hover()
        setMenuIndex((index) => (index + 1) % MENU_OPTIONS.length)
      }

      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault()
        audio.hover()
        setMenuIndex((index) => (index - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length)
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        pickMenu(MENU_OPTIONS[menuIndex].id)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [audio, bootComplete, menuIndex, pickMenu, screen])

  function selectMission(index) {
    audio.select()
    setMissionIndex(index)
    setScreen('hub')
  }

  function markAction(action) {
    setSession((current) => {
      if (current.actions.includes(action)) return current
      return { ...current, actions: [...current.actions, action] }
    })
    audio.hover()
  }

  function missingActions(mission = activeMission) {
    return mission.requiredActions.filter((action) => !session.actions.includes(action))
  }

  async function captureCurrentFrame() {
    const image = await editorRef.current?.editor?.getImage?.()
    if (image) {
      setSession((current) => ({ ...current, editedImage: image }))
      setStatusLine('FRAME CAPTURED')
    } else {
      setStatusLine('SAVE OR CHANGE THE FRAME FIRST')
    }
  }

  function receiveSavedImage({ dataUrl }) {
    setSession((current) => ({ ...current, editedImage: dataUrl }))
    setStatusLine('EDITOR RESULT LOCKED')
  }

  function submitMission() {
    const missing = missingActions()
    if (!session.editedImage || missing.length) {
      setStatusLine(`CHECKLIST OPEN: ${missing.join(', ').toUpperCase() || 'SAVE FRAME'}`)
      return
    }

    const result = {
      ...activeMission,
      editedImage: session.editedImage,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setSession((current) => ({ ...current, submitted: true }))
    setCash((value) => value + activeMission.reward)
    setRep((value) => value + activeMission.rep)
    setCompleted((items) => {
      const rest = items.filter((item) => item.id !== result.id)
      return [...rest, result]
    })
    setStatusLine('TRANSMITTING EDITED FRAME...')
    audio.success()
    setScreen('result')
  }

  function nextMission() {
    setMissionIndex((index) => Math.min(index + 1, MISSIONS.length - 1))
    setScreen('missions')
  }

  const editorOptions = useMemo(() => createOptions(activeMission.tools), [activeMission])

  return (
    <div className={`app screen-${screen}`}>
      <div className="city-backdrop" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {screen === 'boot' && (
        <main className="boot-screen">
          <div className="boot-copy">
            <div className="boot-log">
              {BOOT_LINES.map((line, index) => (
                <span key={line} style={{ animationDelay: `${index * 0.45}s` }}>
                  {line}
                </span>
              ))}
            </div>
            <h1>
              VICE CITY
              <span>AFTER DARK</span>
            </h1>
            <button
              type="button"
              className="press-enter"
              disabled={!bootComplete}
              onClick={() => {
                audio.select()
                setScreen('menu')
              }}
            >
              {bootComplete ? 'PRESS ENTER' : 'BOOTING CITY NETWORK'}
            </button>
          </div>
        </main>
      )}

      {screen === 'menu' && (
        <main className="menu-screen">
          <section className="title-stack">
            <p className="eyebrow">NEON COASTAL CITY // NIGHT WIRE</p>
            <h1>
              VICE CITY
              <span>AFTER DARK</span>
            </h1>
            <p>Underground photos, newsroom heat, and reputation paid in edited frames.</p>
            <div className="menu-score">
              <HudStat label="SCORE" value={score.toLocaleString()} />
              <HudStat label="CASH" value={`$${cash.toLocaleString()}`} />
              <HudStat label="REP" value={`LVL ${String(Math.max(2, Math.floor(rep / 20))).padStart(2, '0')}`} />
            </div>
          </section>
          <nav className="main-menu" aria-label="Main menu">
            {MENU_OPTIONS.map((option, index) => (
              <button
                key={option.id}
                type="button"
                className={menuIndex === index ? 'selected' : ''}
                onMouseEnter={() => {
                  audio.hover()
                  setMenuIndex(index)
                }}
                onClick={() => pickMenu(option.id)}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </nav>
        </main>
      )}

      {screen === 'missions' && (
        <main className="panel-layout">
          <Header onMenu={() => setScreen('menu')} statusLine="MISSION SELECT" />
          <section className="mission-select-head">
            <div>
              <p className="eyebrow">ACTIVE CASE BOARD</p>
              <h2>Choose The Next Frame</h2>
            </div>
            <div className="compact-score">
              <HudStat label="SCORE" value={score.toLocaleString()} />
              <HudStat label="PASSED" value={`${completed.length}/${MISSIONS.length}`} />
            </div>
          </section>
          <section className="mission-grid" aria-label="Mission selection">
            {MISSIONS.map((mission, index) => {
              const passed = completedIds.has(mission.id)
              return (
                <button
                  type="button"
                  key={mission.id}
                  className={`mission-card ${passed ? 'passed' : ''}`}
                  onMouseEnter={audio.hover}
                  onClick={() => selectMission(index)}
                >
                  <img src={mission.image} alt={`${mission.title} source still`} />
                  <span className="pass-mark">{passed ? 'PASSED' : `MISSION ${mission.number}`}</span>
                  <strong>{mission.title}</strong>
                  <small>{mission.codename}</small>
                  <p>{mission.briefing}</p>
                </button>
              )
            })}
          </section>
        </main>
      )}

      {screen === 'hub' && (
        <main className="hub-screen panel-layout">
          <Header onMenu={() => setScreen('menu')} statusLine={statusLine} />
          <section className="hud-grid">
            <HudStat label="PLAYER" value="R. ARCHER" />
            <HudStat label="CASH" value={`$${cash.toLocaleString()}`} />
            <HudStat label="REP" value={`LVL ${String(Math.max(2, Math.floor(rep / 20))).padStart(2, '0')}`} />
            <HudStat label="CURRENT MISSION" value={activeMission.title} />
          </section>
          <section className="mission-brief">
            <div>
              <p className="eyebrow">MISSION {activeMission.number}</p>
              <h2>{activeMission.title}</h2>
              <p className="quote">"{activeMission.officerQuote}"</p>
              <p>{activeMission.briefing}</p>
              <div className="button-row">
                <button type="button" className="primary" onClick={() => {
                  audio.select()
                  openMission(activeMission)
                }}>
                  START MISSION
                </button>
                <button type="button" className="ghost" onClick={() => setScreen('missions')}>
                  SELECT MISSION
                </button>
                <button type="button" className="ghost" onClick={() => setScreen('newsroom')}>
                  NEWSROOM
                </button>
              </div>
            </div>
            <figure className="source-frame">
              <img src={activeMission.image} alt={`${activeMission.title} source still`} />
              <figcaption>{activeMission.codename}</figcaption>
            </figure>
          </section>
          <Ticker />
        </main>
      )}

      {screen === 'editor' && (
        <main className="editor-screen">
          <Header onMenu={() => setScreen('hub')} statusLine={statusLine} />
          <section className="workstation">
            <aside className="objective-panel">
              <p className="eyebrow">MISSION OBJECTIVE</p>
              <h2>{activeMission.objective}</h2>
              <p>{activeMission.briefing}</p>
              <p className="system-note">{activeMission.location}</p>
              <div className="action-list">
                {activeMission.requiredActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className={session.actions.includes(action) ? 'logged' : ''}
                    onClick={() => markAction(action)}
                  >
                    <span>{action.toUpperCase()}</span>
                    <small>{session.actions.includes(action) ? 'LOGGED' : 'CONFIRM'}</small>
                  </button>
                ))}
              </div>
              <div className="button-stack">
                <button type="button" className="ghost" onClick={captureCurrentFrame}>
                  CAPTURE CURRENT FRAME
                </button>
                <button type="button" className="primary" onClick={submitMission}>
                  SUBMIT TO NEWSROOM
                </button>
              </div>
              <p className="system-note">
                Save inside the editor or capture the current canvas, then complete the field log.
              </p>
            </aside>
            <section className="editor-frame">
              <div className="loading-strip">OPENING RAW CAPTURE... LOADING FRAME...</div>
              <ImageEditor
                key={activeMission.id}
                ref={editorRef}
                image={activeMission.image}
                options={editorOptions}
                minHeight="690px"
                ariaLabel={`${activeMission.title} image editor`}
                onSave={receiveSavedImage}
                onCancel={() => setScreen('hub')}
                onLoad={() => setStatusLine('IMAGE EDITOR ONLINE')}
                onLoadError={() => setStatusLine('LOAD ERROR: FRAME CORRUPTED')}
                onError={(error) => {
                  console.error(error)
                  setStatusLine('EDITOR NETWORK ERROR')
                }}
              />
            </section>
          </section>
        </main>
      )}

      {screen === 'result' && (
        <main className="result-screen panel-layout">
          <Header onMenu={() => setScreen('missions')} statusLine="MISSION COMPLETE" />
          <section className="result-grid">
            <div className="mission-complete">
              <p className="eyebrow">TRANSMISSION RECEIVED</p>
              <h2>MISSION COMPLETE</h2>
              <p>+${activeMission.reward} CASH</p>
              <p>+{activeMission.rep} REP</p>
              <p>NEW CONTACT UNLOCKED: {activeMission.unlock}</p>
              <div className="button-row">
                <button type="button" className="primary" onClick={nextMission}>
                  CONTINUE
                </button>
                <button type="button" className="ghost" onClick={() => setScreen('newsroom')}>
                  VIEW NEWSROOM
                </button>
              </div>
            </div>
            <Newspaper item={{ ...activeMission, editedImage: session.editedImage }} />
          </section>
        </main>
      )}

      {screen === 'newsroom' && (
        <main className="panel-layout">
          <Header onMenu={() => setScreen('menu')} statusLine="NEWSROOM ARCHIVE" />
          <section className="newsroom">
            <div>
              <p className="eyebrow">CITY DESK</p>
              <h2>Published Frames</h2>
            </div>
            {newsroomItems.length ? (
              <div className="paper-grid">
                {newsroomItems.map((item) => (
                  <Newspaper key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No edited frames filed. Complete a mission to put your work on the wall.</p>
                <button type="button" className="primary" onClick={() => setScreen('missions')}>
                  OPEN MISSION BOARD
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {screen === 'contacts' && (
        <SimpleScreen title="CONTACTS" status="CONTACTS UNLOCKED" onBack={() => setScreen('menu')}>
          <div className="contact-list">
            {contacts.map((contact) => (
              <span key={contact}>{contact}</span>
            ))}
          </div>
        </SimpleScreen>
      )}

      {screen === 'options' && (
        <SimpleScreen title="OPTIONS" status="SYSTEM SETTINGS" onBack={() => setScreen('menu')}>
          <div className="settings-grid">
            <HudStat label="AUDIO" value="AMBIENT ON" />
            <HudStat label="VISUALS" value="GRAIN ON" />
            <HudStat label="EDITOR" value="UNLAYER OFFICIAL" />
          </div>
        </SimpleScreen>
      )}

      {screen === 'credits' && (
        <SimpleScreen title="CREDITS" status="BUILD WITH IMAGE EDITOR" onBack={() => setScreen('menu')}>
          <p className="wide-copy">
            Built as a cinematic gameplay wrapper around Unlayer's official React Image Editor.
            Mission photographs are edited, saved, and reused in the newsroom.
          </p>
        </SimpleScreen>
      )}
    </div>
  )
}

function Header({ onMenu, statusLine }) {
  return (
    <header className="topbar">
      <button type="button" className="ghost small" onClick={onMenu}>
        BACK
      </button>
      <span>VICE CITY AFTER DARK</span>
      <strong>{statusLine}</strong>
    </header>
  )
}

function HudStat({ label, value }) {
  return (
    <div className="hud-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function Ticker() {
  return (
    <div className="ticker" aria-label="City ticker">
      <span>WVCN: MAYOR DENIES MARINA RUMORS</span>
      <span>DOWNTOWN GRID FLICKERS AFTER MIDNIGHT</span>
      <span>POLICE REQUEST CLEANER PHOTOGRAPHIC EVIDENCE</span>
    </div>
  )
}

function Newspaper({ item }) {
  return (
    <article className="newspaper">
      <p className="paper-name">THE AFTER DARK GAZETTE</p>
      <h3>{item.title} HITS THE WIRE</h3>
      <img src={item.editedImage} alt={`${item.title} edited submission`} />
      <p>
        R. Archer filed the frame at {item.completedAt || '02:17 AM'}. City sources say the
        image changed the case before sunrise.
      </p>
    </article>
  )
}

function SimpleScreen({ title, status, onBack, children }) {
  return (
    <main className="panel-layout">
      <Header onMenu={onBack} statusLine={status} />
      <section className="simple-screen">
        <p className="eyebrow">ARCHIVE TERMINAL</p>
        <h2>{title}</h2>
        {children}
      </section>
    </main>
  )
}

export default App
