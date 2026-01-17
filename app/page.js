'use client'

import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  name: 'NormieOS',
  tagline: 'For the normies, by the normies',
  tokenCA: '6Etq7viXLtZWCAhnkq2MhAcaz7ggkPKpzASfKax7pump',
  twitter: 'https://twitter.com/NormieOS',
  walletAddress: 'NRMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const MOCK_STATUS = {
  status: 'ONLINE',
  balance_sol: 2.4521,
  total_pnl: 0.8234,
  total_trades: 47,
  wins: 32,
  losses: 15,
  win_rate: 68.09,
}

const MOCK_TRADES = [
  { id: 1, symbol: 'DOGE2', name: 'Doge 2.0', tipo: 'BUY', valor_sol: 0.05, score: 85, tx: 'abc123...', time: '2m ago' },
  { id: 2, symbol: 'PEPE', name: 'Pepe Classic', tipo: 'SELL', valor_sol: 0.12, score: 72, tx: 'def456...', time: '5m ago', pnl: '+0.07' },
  { id: 3, symbol: 'WOJAK', name: 'Wojak', tipo: 'BUY', valor_sol: 0.03, score: 91, tx: 'ghi789...', time: '12m ago' },
  { id: 4, symbol: 'MOON', name: 'To The Moon', tipo: 'SELL', valor_sol: 0.08, score: 65, tx: 'jkl012...', time: '18m ago', pnl: '-0.02' },
  { id: 5, symbol: 'CHAD', name: 'Chad Token', tipo: 'BUY', valor_sol: 0.04, score: 78, tx: 'mno345...', time: '25m ago' },
]

const MOCK_TOKENS = [
  { ca: 'abc...', symbol: 'DOGE2', name: 'Doge 2.0', mc: '45.2K', status: 'holding', score: 85, logo: '🐕' },
  { ca: 'def...', symbol: 'PEPE', name: 'Pepe Classic', mc: '120K', status: 'sold_tp', score: 72, logo: '🐸' },
  { ca: 'ghi...', symbol: 'WOJAK', name: 'Wojak', mc: '28.5K', status: 'analyzing', score: 91, logo: '😢' },
  { ca: 'jkl...', symbol: 'MOON', name: 'To The Moon', mc: '15.8K', status: 'rejected', score: 45, logo: '🌙' },
  { ca: 'mno...', symbol: 'CHAD', name: 'Chad Token', mc: '89.3K', status: 'approved', score: 78, logo: '💪' },
  { ca: 'pqr...', symbol: 'COPE', name: 'Cope Coin', mc: '5.2K', status: 'rejected', score: 32, logo: '🎭' },
]

const GALLERY_IMAGES = [
  { id: 1, emoji: '🐕', title: 'Normie Dog', desc: 'Just a normal dog' },
  { id: 2, emoji: '🎩', title: 'Fancy Normie', desc: 'Looking dapper' },
  { id: 3, emoji: '🚀', title: 'Moon Mission', desc: 'To the moon!' },
  { id: 4, emoji: '💎', title: 'Diamond Hands', desc: 'HODL forever' },
  { id: 5, emoji: '☕', title: 'Morning Vibes', desc: 'gm fren' },
  { id: 6, emoji: '🌙', title: 'Night Mode', desc: 'gn fren' },
]

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════
const Icons = {
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Terminal: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Coin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v12M9 9h6M9 15h6"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"/>
      <path d="M16 12h5"/>
      <circle cx="18" cy="12" r="2"/>
    </svg>
  ),
  Link: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Paint-style Frame
const PaintFrame = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-[#FFAD60] to-[#FF8C42]',
    light: 'bg-gradient-to-br from-[#FFF5E6] to-[#FFE4C4]',
    terminal: 'bg-gradient-to-br from-[#3D2E1F] to-[#2D2419]',
    accent: 'bg-gradient-to-br from-[#FFD93D] to-[#FFBF00]',
    dark: 'bg-gradient-to-br from-[#5D4E37] to-[#4D3E27]',
  }
  return (
    <div className={`${variants[variant]} paint-frame p-4 ${className}`}>
      {children}
    </div>
  )
}

// Loading Screen
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#FFAD60] via-[#FF8C42] to-[#FFD93D] flex flex-col items-center justify-center z-50">
    {/* Spinning ring */}
    <div className="relative">
      <div className="absolute inset-0 w-40 h-40 border-4 border-[#5D4E37] rounded-full animate-spin-slow"
           style={{ borderTopColor: '#FFD93D', borderRightColor: 'transparent' }}></div>
      <div className="w-32 h-32 m-4 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFAD60] flex items-center justify-center text-6xl animate-bounce-slow paint-frame">
        🐕
      </div>
    </div>
    <h1 className="text-4xl font-black mt-8 text-[#5D4E37]">{CONFIG.name}</h1>
    <p className="mt-2 text-[#5D4E37] opacity-80 animate-blink">Loading...</p>
  </div>
)

// Copy Button
const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`retro-btn px-3 py-1 flex items-center gap-1 text-sm ${
        copied ? 'bg-green-400' : 'bg-[#FFD93D] hover:bg-[#FFE566]'
      } text-[#5D4E37]`}
    >
      {copied ? <Icons.Check /> : <Icons.Copy />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

// Status Badge
const StatusBadge = ({ status }) => {
  const statusStyles = {
    ONLINE: 'bg-green-400 text-green-900',
    OFFLINE: 'bg-red-400 text-red-900',
    RECONNECTING: 'bg-yellow-400 text-yellow-900',
    analyzing: 'bg-blue-400 text-blue-900',
    approved: 'bg-green-400 text-green-900',
    rejected: 'bg-red-400 text-red-900',
    holding: 'bg-purple-400 text-purple-900',
    sold_tp: 'bg-green-300 text-green-900',
    sold_sl: 'bg-red-300 text-red-900',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyles[status] || 'bg-gray-400'}`}>
      {status}
    </span>
  )
}

// Tab Button
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-bold flex items-center gap-2 border-2 border-b-0 border-[#5D4E37] rounded-t-xl transition-all ${
      active ? 'tab-active text-[#5D4E37]' : 'tab-inactive text-[#5D4E37]'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
)

// Trade Row
const TradeRow = ({ trade, index }) => (
  <div
    className={`flex items-center justify-between p-3 ${
      index % 2 === 0 ? 'bg-[#FFE4C4]/50' : 'bg-[#FFF5E6]/50'
    } hover:bg-[#FFD93D]/30 transition-colors animate-slide-up`}
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-center gap-3">
      <span className={`px-2 py-1 rounded font-bold text-xs ${
        trade.tipo === 'BUY' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
      }`}>
        {trade.tipo}
      </span>
      <div>
        <span className="font-bold">{trade.symbol}</span>
        <span className="text-sm text-[#5D4E37]/70 ml-2">{trade.name}</span>
      </div>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="font-mono">{trade.valor_sol} SOL</span>
      {trade.pnl && (
        <span className={trade.pnl.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {trade.pnl}
        </span>
      )}
      <span className="text-[#5D4E37]/60">Score: {trade.score}</span>
      <span className="text-[#5D4E37]/50">{trade.time}</span>
      <a href={`https://solscan.io/tx/${trade.tx}`} target="_blank" rel="noopener noreferrer"
         className="text-[#FF8C42] hover:text-[#FFAD60]">
        <Icons.Link />
      </a>
    </div>
  </div>
)

// Token Card
const TokenCard = ({ token, index }) => (
  <div
    className="paint-frame-sm bg-gradient-to-br from-[#FFF5E6] to-[#FFE4C4] p-4 hover:scale-[1.02] transition-transform animate-slide-up"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFAD60] flex items-center justify-center text-2xl paint-frame-sm">
          {token.logo}
        </div>
        <div>
          <h3 className="font-bold text-lg">{token.symbol}</h3>
          <p className="text-sm text-[#5D4E37]/70">{token.name}</p>
        </div>
      </div>
      <StatusBadge status={token.status} />
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#5D4E37]/20">
      <div className="text-sm">
        <span className="text-[#5D4E37]/60">MC:</span>
        <span className="font-bold ml-1">${token.mc}</span>
      </div>
      <div className="text-sm">
        <span className="text-[#5D4E37]/60">Score:</span>
        <span className="font-bold ml-1">{token.score}</span>
      </div>
      <CopyButton text={token.ca} label="CA" />
    </div>
  </div>
)

// Gallery Item
const GalleryItem = ({ item, index }) => (
  <div
    className="paint-frame-sm bg-gradient-to-br from-[#FFF5E6] to-[#FFE4C4] p-4 text-center hover:scale-105 transition-transform cursor-pointer animate-slide-up"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="text-6xl mb-3 animate-float-slow" style={{ animationDelay: `${index * 0.3}s` }}>
      {item.emoji}
    </div>
    <h3 className="font-bold">{item.title}</h3>
    <p className="text-sm text-[#5D4E37]/70">{item.desc}</p>
  </div>
)

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function TradingDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('terminal')
  const [status, setStatus] = useState(MOCK_STATUS)
  const [trades, setTrades] = useState(MOCK_TRADES)
  const [tokens, setTokens] = useState(MOCK_TOKENS)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Simulate realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        balance_sol: prev.balance_sol + (Math.random() - 0.5) * 0.01,
        total_pnl: prev.total_pnl + (Math.random() - 0.5) * 0.005,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <PaintFrame variant="default" className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD93D]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF8C42]/30 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFAD60] flex items-center justify-center text-5xl paint-frame animate-bounce-slow">
                🐕
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-[#5D4E37] animate-pulse"></div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#5D4E37]">{CONFIG.name}</h1>
                <span className="text-2xl animate-wiggle">🚀</span>
              </div>
              <p className="text-[#5D4E37]/80 mt-1">{CONFIG.tagline}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-[#FFF5E6]/50 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#5D4E37]/60">Balance</span>
                  <p className="font-bold text-lg">{status.balance_sol.toFixed(4)} SOL</p>
                </div>
                <div className="bg-[#FFF5E6]/50 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#5D4E37]/60">Total PNL</span>
                  <p className={`font-bold text-lg ${status.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {status.total_pnl >= 0 ? '+' : ''}{status.total_pnl.toFixed(4)} SOL
                  </p>
                </div>
                <div className="bg-[#FFF5E6]/50 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#5D4E37]/60">Win Rate</span>
                  <p className="font-bold text-lg">{status.win_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Twitter Button */}
            <a
              href={CONFIG.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn bg-[#5D4E37] text-white p-3 hover:bg-[#4D3E27]"
            >
              <Icons.Twitter />
            </a>
          </div>
        </PaintFrame>

        {/* TOKEN CA BANNER */}
        <PaintFrame variant="accent" className="animate-pulse-glow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icons.Coin />
              <span className="font-bold">Contract Address:</span>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-center">
              <code className="font-mono text-sm bg-[#5D4E37]/10 px-3 py-1 rounded break-all">
                {CONFIG.tokenCA}
              </code>
            </div>
            <CopyButton text={CONFIG.tokenCA} label="Copy CA" />
          </div>
        </PaintFrame>

        {/* TABS */}
        <div className="flex gap-1 overflow-x-auto pb-0">
          <TabButton
            active={activeTab === 'terminal'}
            onClick={() => setActiveTab('terminal')}
            icon={<Icons.Terminal />}
            label="Terminal"
          />
          <TabButton
            active={activeTab === 'watching'}
            onClick={() => setActiveTab('watching')}
            icon={<Icons.Eye />}
            label="Watching"
          />
          <TabButton
            active={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
            icon={<Icons.Image />}
            label="Gallery"
          />
          <TabButton
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
            icon={<Icons.Info />}
            label="About"
          />
        </div>

        {/* TAB CONTENT */}
        <PaintFrame variant="light" className="min-h-[400px] -mt-2 rounded-tl-none">

          {/* TERMINAL TAB */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#5D4E37]/20">
                <div className="flex items-center gap-4">
                  <StatusBadge status={status.status} />
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.Wallet />
                    <code className="font-mono">{CONFIG.walletAddress.slice(0, 8)}...{CONFIG.walletAddress.slice(-4)}</code>
                    <CopyButton text={CONFIG.walletAddress} label="" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>Trades: <strong>{status.total_trades}</strong></span>
                  <span className="text-green-600">W: {status.wins}</span>
                  <span className="text-red-600">L: {status.losses}</span>
                </div>
              </div>

              {/* Trades List */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Icons.Terminal />
                  Recent Trades
                </h3>
                <div className="paint-frame-sm overflow-hidden">
                  {trades.map((trade, i) => (
                    <TradeRow key={trade.id} trade={trade} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WATCHING TAB */}
          {activeTab === 'watching' && (
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Eye />
                Tokens Being Watched ({tokens.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens.map((token, i) => (
                  <TokenCard key={token.ca} token={token} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Image />
                Normie Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {GALLERY_IMAGES.map((item, i) => (
                  <GalleryItem key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-float-slow">🐕</div>
                <h2 className="text-2xl font-bold">What is {CONFIG.name}?</h2>
              </div>

              <PaintFrame variant="default" className="text-[#5D4E37]">
                <h3 className="font-bold text-lg mb-2">🤖 AI-Powered Trading</h3>
                <p>
                  {CONFIG.name} is an AI-powered trading bot that monitors new memecoins on Solana.
                  It analyzes each token using advanced AI and automatically executes trades based on the analysis.
                </p>
              </PaintFrame>

              <PaintFrame variant="accent" className="text-[#5D4E37]">
                <h3 className="font-bold text-lg mb-2">📊 How It Works</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Bot monitors Pump.fun for new tokens</li>
                  <li>AI analyzes narrative, ticker, and image</li>
                  <li>Scores above threshold trigger auto-buy</li>
                  <li>Positions are managed with TP/SL</li>
                  <li>All trades shown live on this dashboard</li>
                </ol>
              </PaintFrame>

              <PaintFrame variant="light" className="text-[#5D4E37]">
                <h3 className="font-bold text-lg mb-2">💰 Support the Bot</h3>
                <p className="mb-3">Send SOL to fund the trading wallet:</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-[#5D4E37]/10 px-3 py-2 rounded flex-1 break-all">
                    {CONFIG.walletAddress}
                  </code>
                  <CopyButton text={CONFIG.walletAddress} label="Copy" />
                </div>
              </PaintFrame>

              <div className="text-center text-sm text-[#5D4E37]/60">
                <p>Not financial advice. Trade at your own risk.</p>
                <p className="mt-1">© 2024 {CONFIG.name} - All memes reserved</p>
              </div>
            </div>
          )}
        </PaintFrame>

        {/* FOOTER */}
        <div className="text-center text-sm text-[#5D4E37]/60 pb-4">
          <p>Built with ☕ by normies, for normies</p>
        </div>
      </div>
    </div>
  )
}
