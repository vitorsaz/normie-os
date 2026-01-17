'use client'

import { useState, useRef, useEffect } from 'react'

// Sound effects using Web Audio API
const useSound = () => {
  const audioContext = useRef(null)

  const playSound = (type) => {
    if (typeof window === 'undefined') return

    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const ctx = audioContext.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    switch(type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.05)
        break
      case 'open':
        oscillator.frequency.setValueAtTime(400, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.1)
        break
      case 'close':
        oscillator.frequency.setValueAtTime(500, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.08)
        break
      case 'error':
        oscillator.frequency.setValueAtTime(200, ctx.currentTime)
        oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.2)
        break
      case 'startup':
        const osc1 = ctx.createOscillator()
        const gain1 = ctx.createGain()
        osc1.connect(gain1)
        gain1.connect(ctx.destination)
        osc1.frequency.setValueAtTime(523, ctx.currentTime)
        osc1.frequency.setValueAtTime(659, ctx.currentTime + 0.15)
        osc1.frequency.setValueAtTime(784, ctx.currentTime + 0.3)
        osc1.frequency.setValueAtTime(1047, ctx.currentTime + 0.45)
        gain1.gain.setValueAtTime(0.1, ctx.currentTime)
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
        osc1.start(ctx.currentTime)
        osc1.stop(ctx.currentTime + 0.6)
        return
    }
  }

  return playSound
}

// Draggable Window Component
const Window = ({ title, children, isOpen, onClose, onMinimize, onFocus, zIndex, icon, initialPos }) => {
  const [position, setPosition] = useState(initialPos || { x: 100, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)
  const playSound = useSound()

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    onFocus()
    playSound('click')
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(0, e.clientY - dragOffset.y)
        })
      }
    }
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className="absolute shadow-xl"
      style={{ left: position.x, top: position.y, zIndex }}
      onClick={onFocus}
    >
      {/* Window Frame */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-t-lg px-2 py-1 flex items-center justify-between cursor-move select-none"
           onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-white text-sm font-bold drop-shadow">{title}</span>
        </div>
        <div className="window-controls flex gap-1">
          <button onClick={() => { playSound('click'); onMinimize() }}
                  className="w-5 h-5 bg-gradient-to-b from-blue-300 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold hover:from-blue-200 hover:to-blue-400 border border-blue-700">
            _
          </button>
          <button className="w-5 h-5 bg-gradient-to-b from-blue-300 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold hover:from-blue-200 hover:to-blue-400 border border-blue-700">
            □
          </button>
          <button onClick={() => { playSound('close'); onClose() }}
                  className="w-5 h-5 bg-gradient-to-b from-red-400 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold hover:from-red-300 hover:to-red-500 border border-red-700">
            ✕
          </button>
        </div>
      </div>
      {/* Window Content */}
      <div className="bg-gray-100 border-2 border-t-0 border-blue-600 rounded-b-lg min-w-80">
        {children}
      </div>
    </div>
  )
}

// Desktop Icon Component
const DesktopIcon = ({ icon, label, onClick }) => {
  const playSound = useSound()

  return (
    <div
      className="flex flex-col items-center w-20 p-2 cursor-pointer hover:bg-blue-500/30 rounded select-none"
      onDoubleClick={() => { playSound('open'); onClick() }}
    >
      <div className="text-4xl drop-shadow-lg">{icon}</div>
      <span className="text-white text-xs text-center mt-1 drop-shadow-md font-semibold">{label}</span>
    </div>
  )
}

// Main App
export default function WindowsDesktop() {
  const [windows, setWindows] = useState({
    readme: false,
    calculator: false,
    gallery: false,
    about: false,
    terminal: false,
    music: false
  })
  const [minimized, setMinimized] = useState({})
  const [zIndexes, setZIndexes] = useState({})
  const [maxZ, setMaxZ] = useState(100)
  const [startOpen, setStartOpen] = useState(false)
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrev, setCalcPrev] = useState(null)
  const [calcOp, setCalcOp] = useState(null)
  const [terminalText, setTerminalText] = useState('C:\\Users\\Normie> ')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [booting, setBooting] = useState(true)
  const [copied, setCopied] = useState(false)
  const playSound = useSound()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      playSound('startup')
      setTimeout(() => setBooting(false), 1500)
    }, 500)
  }, [])

  const openWindow = (name) => {
    setWindows(prev => ({ ...prev, [name]: true }))
    setMinimized(prev => ({ ...prev, [name]: false }))
    focusWindow(name)
    playSound('open')
  }

  const closeWindow = (name) => {
    setWindows(prev => ({ ...prev, [name]: false }))
  }

  const minimizeWindow = (name) => {
    setMinimized(prev => ({ ...prev, [name]: true }))
  }

  const focusWindow = (name) => {
    setMaxZ(prev => prev + 1)
    setZIndexes(prev => ({ ...prev, [name]: maxZ + 1 }))
  }

  const restoreWindow = (name) => {
    setMinimized(prev => ({ ...prev, [name]: false }))
    focusWindow(name)
  }

  // Copy CA function
  const copyCA = () => {
    navigator.clipboard.writeText('6Etq7viXLtZWCAhnkq2MhAcaz7ggkPKpzASfKax7pump')
    setCopied(true)
    playSound('click')
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculator functions
  const calcInput = (num) => {
    playSound('click')
    setCalcDisplay(prev => prev === '0' ? num : prev + num)
  }

  const calcOperation = (op) => {
    playSound('click')
    setCalcPrev(parseFloat(calcDisplay))
    setCalcOp(op)
    setCalcDisplay('0')
  }

  const calcEquals = () => {
    playSound('click')
    if (calcPrev !== null && calcOp) {
      const current = parseFloat(calcDisplay)
      let result
      switch(calcOp) {
        case '+': result = calcPrev + current; break
        case '-': result = calcPrev - current; break
        case '*': result = calcPrev * current; break
        case '/': result = calcPrev / current; break
        default: result = current
      }
      setCalcDisplay(String(result))
      setCalcPrev(null)
      setCalcOp(null)
    }
  }

  const calcClear = () => {
    playSound('click')
    setCalcDisplay('0')
    setCalcPrev(null)
    setCalcOp(null)
  }

  if (booting) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-6xl mb-8">🪟</div>
        <div className="text-white text-2xl mb-4 font-bold">NormieOS XP</div>
        <div className="w-48 h-2 bg-gray-700 rounded overflow-hidden">
          <div className="h-full bg-blue-500 loading-bar"></div>
        </div>
        <div className="text-gray-400 mt-4 text-sm">Starting up...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen overflow-hidden relative"
         style={{background: 'linear-gradient(180deg, #245EDC 0%, #3A7BD5 30%, #63B521 30%, #7FCA35 100%)'}}
         onClick={() => setStartOpen(false)}>

      {/* Desktop Background - Bliss style hills */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-green-500 via-green-400 to-green-300"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-48 bg-green-400 rounded-full blur-xl opacity-50"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-40 bg-green-500 rounded-full blur-xl opacity-50"></div>
        {/* Clouds */}
        <div className="absolute top-16 left-10 w-32 h-12 bg-white/40 rounded-full blur-md"></div>
        <div className="absolute top-20 left-20 w-24 h-10 bg-white/30 rounded-full blur-md"></div>
        <div className="absolute top-12 right-20 w-40 h-14 bg-white/35 rounded-full blur-md"></div>
        <div className="absolute top-8 right-40 w-28 h-10 bg-white/25 rounded-full blur-md"></div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <DesktopIcon icon="📄" label="README.txt" onClick={() => openWindow('readme')} />
        <DesktopIcon icon="🧮" label="Calculator" onClick={() => openWindow('calculator')} />
        <DesktopIcon icon="🖼️" label="Gallery" onClick={() => openWindow('gallery')} />
        <DesktopIcon icon="💻" label="Terminal" onClick={() => openWindow('terminal')} />
        <DesktopIcon icon="🎵" label="Music" onClick={() => openWindow('music')} />
        <DesktopIcon icon="ℹ️" label="About" onClick={() => openWindow('about')} />
      </div>

      {/* README Window */}
      <Window
        title="README.txt - Notepad"
        icon="📄"
        isOpen={windows.readme && !minimized.readme}
        onClose={() => closeWindow('readme')}
        onMinimize={() => minimizeWindow('readme')}
        onFocus={() => focusWindow('readme')}
        zIndex={zIndexes.readme || 100}
        initialPos={{ x: 150, y: 80 }}
      >
        <div className="bg-gray-200 px-2 py-1 text-xs border-b">
          <span className="mr-4 hover:bg-gray-300 px-1 cursor-pointer">File</span>
          <span className="mr-4 hover:bg-gray-300 px-1 cursor-pointer">Edit</span>
          <span className="mr-4 hover:bg-gray-300 px-1 cursor-pointer">Format</span>
          <span className="hover:bg-gray-300 px-1 cursor-pointer">Help</span>
        </div>
        <div className="bg-white p-3 min-h-48 font-mono text-sm">
          <p className="mb-2">Welcome to NormieOS! 🐕</p>
          <p className="mb-2">but most of us? we're just normies.</p>
          <p className="mb-2">no cope. no threads. keep it simple.</p>
          <p className="mb-4">cute funny memes prevail.</p>
          <p className="text-gray-500">-----------------------------------</p>
          <p className="mt-2 text-xs text-gray-600">Contract Address:</p>
          <p className="bg-gray-100 p-2 text-xs mt-1 rounded font-mono break-all">
            6Etq7viXLtZWCAhnkq2MhAcaz7ggkPKpzASfKax7pump
          </p>
          <button
            onClick={copyCA}
            className={`mt-3 w-full ${copied ? 'bg-blue-500' : 'bg-green-500 hover:bg-green-600'} text-white py-2 rounded font-bold transition-colors`}
          >
            {copied ? '✓ COPIED!' : 'COPY CA'}
          </button>
        </div>
      </Window>

      {/* Calculator Window */}
      <Window
        title="Calculator"
        icon="🧮"
        isOpen={windows.calculator && !minimized.calculator}
        onClose={() => closeWindow('calculator')}
        onMinimize={() => minimizeWindow('calculator')}
        onFocus={() => focusWindow('calculator')}
        zIndex={zIndexes.calculator || 100}
        initialPos={{ x: 400, y: 100 }}
      >
        <div className="p-2 bg-gray-300">
          <div className="bg-green-200 p-2 text-right text-2xl font-mono mb-2 border-2 border-gray-400">
            {calcDisplay}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') calcEquals()
                  else if (['+','-','*','/'].includes(btn)) calcOperation(btn)
                  else calcInput(btn)
                }}
                className="bg-gray-200 hover:bg-gray-100 border-2 border-gray-400 p-2 font-bold active:bg-gray-300"
              >
                {btn}
              </button>
            ))}
            <button onClick={calcClear} className="col-span-4 bg-red-300 hover:bg-red-200 border-2 border-gray-400 p-2 font-bold">
              CLEAR
            </button>
          </div>
        </div>
      </Window>

      {/* Gallery Window */}
      <Window
        title="Meme Gallery"
        icon="🖼️"
        isOpen={windows.gallery && !minimized.gallery}
        onClose={() => closeWindow('gallery')}
        onMinimize={() => minimizeWindow('gallery')}
        onFocus={() => focusWindow('gallery')}
        zIndex={zIndexes.gallery || 100}
        initialPos={{ x: 200, y: 120 }}
      >
        <div className="p-4 grid grid-cols-3 gap-2 bg-white">
          {['🐕', '🎩', '🌙', '🚀', '💎', '🔥', '😂', '👑', '⭐'].map((emoji, i) => (
            <div key={i} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-3xl hover:bg-gray-300 cursor-pointer border-2 border-gray-400 hover:scale-105 transition-transform"
                 onClick={() => playSound('click')}>
              {emoji}
            </div>
          ))}
        </div>
        <div className="bg-gray-200 px-3 py-2 text-xs text-gray-600 border-t">
          9 items | Double-click to view
        </div>
      </Window>

      {/* Terminal Window */}
      <Window
        title="Command Prompt"
        icon="💻"
        isOpen={windows.terminal && !minimized.terminal}
        onClose={() => closeWindow('terminal')}
        onMinimize={() => minimizeWindow('terminal')}
        onFocus={() => focusWindow('terminal')}
        zIndex={zIndexes.terminal || 100}
        initialPos={{ x: 300, y: 150 }}
      >
        <div className="bg-black p-3 min-h-48 font-mono text-sm min-w-96">
          <p className="text-green-400">NormieOS [Version 1.0.0]</p>
          <p className="text-green-400 mb-2">(c) 2024 Normie Corp. All rights reserved.</p>
          <p className="text-green-400 mb-1"></p>
          <p className="text-green-400 mb-1">C:\Users\Normie&gt; echo "gm"</p>
          <p className="text-green-400 mb-1">"gm"</p>
          <p className="text-green-400 mb-1"></p>
          <p className="text-green-400 mb-1">C:\Users\Normie&gt; normie --status</p>
          <p className="text-green-400 mb-1">Status: Maximum Comfy</p>
          <p className="text-green-400 mb-1">Rug Status: 0 (ngmi-proof)</p>
          <p className="text-green-400 mb-1"></p>
          <div className="text-green-400 flex">
            <span>{terminalText}</span>
            <span className="cursor-blink">█</span>
          </div>
        </div>
      </Window>

      {/* Music Window */}
      <Window
        title="Normie Music Player"
        icon="🎵"
        isOpen={windows.music && !minimized.music}
        onClose={() => closeWindow('music')}
        onMinimize={() => minimizeWindow('music')}
        onFocus={() => focusWindow('music')}
        zIndex={zIndexes.music || 100}
        initialPos={{ x: 450, y: 180 }}
      >
        <div className="p-4 bg-gradient-to-b from-purple-900 to-black text-white min-w-64">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2 animate-bounce">🎵</div>
            <p className="font-bold">Now Playing:</p>
            <p className="text-purple-300">normie_anthem.mp3</p>
          </div>
          <div className="bg-gray-700 h-2 rounded mb-4 overflow-hidden">
            <div className="bg-purple-500 h-full w-1/3 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => playSound('click')} className="text-2xl hover:scale-110 transition">⏮️</button>
            <button onClick={() => playSound('click')} className="text-3xl hover:scale-110 transition">▶️</button>
            <button onClick={() => playSound('click')} className="text-2xl hover:scale-110 transition">⏭️</button>
          </div>
          <div className="mt-4 flex items-center gap-2 justify-center">
            <span className="text-sm">🔊</span>
            <div className="w-24 h-2 bg-gray-700 rounded">
              <div className="bg-purple-400 h-full w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </Window>

      {/* About Window */}
      <Window
        title="About NormieOS"
        icon="ℹ️"
        isOpen={windows.about && !minimized.about}
        onClose={() => closeWindow('about')}
        onMinimize={() => minimizeWindow('about')}
        onFocus={() => focusWindow('about')}
        zIndex={zIndexes.about || 100}
        initialPos={{ x: 250, y: 100 }}
      >
        <div className="p-6 bg-gray-100 text-center">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-xl font-bold mb-2">NormieOS XP</h2>
          <p className="text-gray-600 mb-2">Version 1.0.0</p>
          <p className="text-sm text-gray-500 mb-4">For the normies, by the normies</p>
          <div className="text-left bg-white p-3 rounded border text-xs mb-4">
            <p className="mb-1"><strong>Features:</strong></p>
            <p>• 100% Community Owned</p>
            <p>• 0% Rugs</p>
            <p>• Infinite Vibes</p>
            <p>• Maximum Comfy</p>
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-400">© 2024 Normie Corporation</p>
            <p className="text-xs text-gray-400">All memes reserved</p>
          </div>
          <button onClick={() => { playSound('click'); closeWindow('about') }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
            OK
          </button>
        </div>
      </Window>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 flex items-center px-2 z-50 border-t-2 border-blue-400">
        {/* Start Button */}
        <button
          onClick={(e) => { e.stopPropagation(); playSound('click'); setStartOpen(!startOpen) }}
          className={`flex items-center gap-2 px-3 py-1 rounded ${startOpen ? 'bg-blue-800' : 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500'} text-white font-bold text-sm border border-green-700`}
        >
          <span>🪟</span> Start
        </button>

        {/* Quick Launch */}
        <div className="h-6 w-px bg-blue-400 mx-2"></div>

        {/* Open Windows in Taskbar */}
        <div className="flex gap-1 flex-1 overflow-hidden">
          {Object.entries(windows).filter(([_, isOpen]) => isOpen).map(([name]) => (
            <button
              key={name}
              onClick={() => { playSound('click'); restoreWindow(name) }}
              className={`px-3 py-1 text-white text-xs rounded ${minimized[name] ? 'bg-blue-800' : 'bg-blue-600'} hover:bg-blue-500 border border-blue-400 max-w-32 truncate flex-shrink-0`}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 bg-blue-800 px-3 py-1 rounded text-white text-xs">
          <span>🔊</span>
          <span>🌐</span>
          <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      {/* Start Menu */}
      {startOpen && (
        <div className="absolute bottom-10 left-0 w-72 bg-white rounded-tr-lg shadow-2xl z-50 overflow-hidden border-2 border-blue-500"
             onClick={(e) => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl border-2 border-white">🐕</div>
            <div>
              <span className="text-white font-bold block">Normie</span>
              <span className="text-blue-100 text-xs">Just a normie</span>
            </div>
          </div>
          <div className="flex">
            <div className="flex-1 bg-white py-1">
              {[
                { icon: '📄', label: 'README', action: () => openWindow('readme') },
                { icon: '🧮', label: 'Calculator', action: () => openWindow('calculator') },
                { icon: '🖼️', label: 'Gallery', action: () => openWindow('gallery') },
                { icon: '💻', label: 'Terminal', action: () => openWindow('terminal') },
                { icon: '🎵', label: 'Music Player', action: () => openWindow('music') },
                { icon: 'ℹ️', label: 'About', action: () => openWindow('about') },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.action(); setStartOpen(false) }}
                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-blue-100 text-left text-sm">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="w-28 bg-blue-50 p-2 border-l">
              <p className="text-xs text-gray-500 mb-2 px-1">Links</p>
              <a href="https://pump.fun" target="_blank" rel="noopener noreferrer"
                 className="block px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded">
                🚀 Pump.fun
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                 className="block px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded">
                🐦 Twitter/X
              </a>
              <div className="border-t my-2"></div>
              <button onClick={() => { playSound('error'); alert('Cannot shut down. Normie mode is eternal.') }}
                      className="w-full px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                <span>🔴</span> Shut Down
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
