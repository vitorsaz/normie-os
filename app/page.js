'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
// COLORS (Verde Musgo)
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#4A5D23',
  secondary: '#6B8E23',
  accent: '#8FBC8F',
  text: '#2F3E1C',
  light: '#E8F5E9',
  dark: '#1B2E0A',
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
  { ca: 'abc...', symbol: 'DOGE2', name: 'Doge 2.0', mc: '45.2K', status: 'holding', score: 85 },
  { ca: 'def...', symbol: 'PEPE', name: 'Pepe Classic', mc: '120K', status: 'sold_tp', score: 72 },
  { ca: 'ghi...', symbol: 'WOJAK', name: 'Wojak', mc: '28.5K', status: 'analyzing', score: 91 },
  { ca: 'jkl...', symbol: 'MOON', name: 'To The Moon', mc: '15.8K', status: 'rejected', score: 45 },
  { ca: 'mno...', symbol: 'CHAD', name: 'Chad Token', mc: '89.3K', status: 'approved', score: 78 },
  { ca: 'pqr...', symbol: 'COPE', name: 'Cope Coin', mc: '5.2K', status: 'rejected', score: 32 },
]

const GALLERY_ITEMS = [
  { id: 1, src: '/gallery/1.png', title: 'The Beginning', desc: 'Where it all started' },
  { id: 2, src: '/gallery/2.png', title: 'Diamond Hands', desc: 'Never selling' },
  { id: 3, src: '/gallery/3.png', title: 'Moon Mission', desc: 'To the moon' },
  { id: 4, src: '/gallery/4.png', title: 'Normie Life', desc: 'Just vibing' },
  { id: 5, src: '/gallery/5.png', title: 'WAGMI', desc: 'We all gonna make it' },
  { id: 6, src: '/gallery/6.png', title: 'Pump It', desc: 'Number go up' },
  { id: 7, src: '/gallery/7.png', title: 'Hodl Mode', desc: 'Holding strong' },
  { id: 8, src: '/gallery/8.png', title: 'Legendary', desc: 'The final form' },
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
  ImageIcon: () => (
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
  Rocket: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Coffee: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
      <line x1="6" y1="2" x2="6" y2="4"/>
      <line x1="10" y1="2" x2="10" y2="4"/>
      <line x1="14" y1="2" x2="14" y2="4"/>
    </svg>
  ),
  Token: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v12"/>
      <path d="M6 12h12"/>
    </svg>
  ),
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Paint-style Frame
const PaintFrame = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-[#6B8E23] to-[#4A5D23]',
    light: 'bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]',
    terminal: 'bg-gradient-to-br from-[#2F3E1C] to-[#1B2E0A]',
    accent: 'bg-gradient-to-br from-[#8FBC8F] to-[#6B8E23]',
    dark: 'bg-gradient-to-br from-[#4A5D23] to-[#2F3E1C]',
  }
  return (
    <div className={`${variants[variant]} paint-frame p-4 ${className}`}>
      {children}
    </div>
  )
}

// Loading Screen
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#6B8E23] via-[#4A5D23] to-[#8FBC8F] flex flex-col items-center justify-center z-50">
    <div className="relative">
      <div className="absolute inset-0 w-40 h-40 border-4 border-[#2F3E1C] rounded-full animate-spin-slow"
           style={{ borderTopColor: '#8FBC8F', borderRightColor: 'transparent' }}></div>
      <div className="w-32 h-32 m-4 rounded-full overflow-hidden animate-bounce-slow paint-frame">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
      </div>
    </div>
    <h1 className="text-4xl font-black mt-8 text-[#E8F5E9]">{CONFIG.name}</h1>
    <p className="mt-2 text-[#C8E6C9] opacity-80 animate-blink">Loading...</p>
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
        copied ? 'bg-green-400' : 'bg-[#8FBC8F] hover:bg-[#A5D6A7]'
      } text-[#2F3E1C]`}
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
    className={`px-4 py-2 font-bold flex items-center gap-2 border-2 border-b-0 border-[#2F3E1C] rounded-t-xl transition-all ${
      active ? 'tab-active text-[#E8F5E9]' : 'tab-inactive text-[#2F3E1C]'
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
      index % 2 === 0 ? 'bg-[#C8E6C9]/50' : 'bg-[#E8F5E9]/50'
    } hover:bg-[#8FBC8F]/30 transition-colors animate-slide-up`}
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-center gap-3">
      <span className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 ${
        trade.tipo === 'BUY' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
      }`}>
        {trade.tipo === 'BUY' ? <Icons.TrendUp /> : <Icons.TrendDown />}
        {trade.tipo}
      </span>
      <div>
        <span className="font-bold">{trade.symbol}</span>
        <span className="text-sm text-[#2F3E1C]/70 ml-2">{trade.name}</span>
      </div>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="font-mono">{trade.valor_sol} SOL</span>
      {trade.pnl && (
        <span className={trade.pnl.startsWith('+') ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {trade.pnl}
        </span>
      )}
      <span className="text-[#2F3E1C]/60">Score: {trade.score}</span>
      <span className="text-[#2F3E1C]/50">{trade.time}</span>
      <a href={`https://solscan.io/tx/${trade.tx}`} target="_blank" rel="noopener noreferrer"
         className="text-[#4A5D23] hover:text-[#6B8E23]">
        <Icons.Link />
      </a>
    </div>
  </div>
)

// Token Card
const TokenCard = ({ token, index }) => (
  <div
    className="paint-frame-sm bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4 hover:scale-[1.02] transition-transform animate-slide-up"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden paint-frame-sm">
          <img src="/logo.png" alt="Token" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{token.symbol}</h3>
          <p className="text-sm text-[#2F3E1C]/70">{token.name}</p>
        </div>
      </div>
      <StatusBadge status={token.status} />
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2F3E1C]/20">
      <div className="text-sm">
        <span className="text-[#2F3E1C]/60">MC:</span>
        <span className="font-bold ml-1">${token.mc}</span>
      </div>
      <div className="text-sm">
        <span className="text-[#2F3E1C]/60">Score:</span>
        <span className="font-bold ml-1">{token.score}</span>
      </div>
      <CopyButton text={token.ca} label="CA" />
    </div>
  </div>
)

// Gallery Item with fancy frame
const GalleryItem = ({ item, index }) => (
  <div
    className="group relative animate-slide-up"
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    {/* Outer decorative frame */}
    <div className="absolute -inset-2 bg-gradient-to-br from-[#4A5D23] via-[#6B8E23] to-[#8FBC8F] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity"></div>

    {/* Inner frame with photo */}
    <div className="relative bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl overflow-hidden border-4 border-[#2F3E1C] shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-[1.02]">
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#4A5D23]"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#4A5D23]"></div>
      <div className="absolute bottom-8 left-1 w-3 h-3 border-b-2 border-l-2 border-[#4A5D23]"></div>
      <div className="absolute bottom-8 right-1 w-3 h-3 border-b-2 border-r-2 border-[#4A5D23]"></div>

      {/* Image container */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Title plate at bottom */}
      <div className="bg-gradient-to-r from-[#4A5D23] via-[#6B8E23] to-[#4A5D23] px-3 py-2 text-center border-t-2 border-[#2F3E1C]">
        <h3 className="font-bold text-[#E8F5E9] text-sm truncate">{item.title}</h3>
        <p className="text-xs text-[#C8E6C9]/80 truncate">{item.desc}</p>
      </div>
    </div>
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8FBC8F]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4A5D23]/30 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden paint-frame animate-bounce-slow">
                <img src="/logo.png" alt="NormieOS Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-[#2F3E1C] animate-pulse"></div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#E8F5E9]">{CONFIG.name}</h1>
                <span className="animate-wiggle text-[#E8F5E9]"><Icons.Rocket /></span>
              </div>
              <p className="text-[#C8E6C9] mt-1">{CONFIG.tagline}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Balance</span>
                  <p className="font-bold text-lg text-[#E8F5E9]">{status.balance_sol.toFixed(4)} SOL</p>
                </div>
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Total PNL</span>
                  <p className={`font-bold text-lg ${status.total_pnl >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {status.total_pnl >= 0 ? '+' : ''}{status.total_pnl.toFixed(4)} SOL
                  </p>
                </div>
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Win Rate</span>
                  <p className="font-bold text-lg text-[#E8F5E9]">{status.win_rate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Twitter Button */}
            <a
              href={CONFIG.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn bg-[#2F3E1C] text-[#E8F5E9] p-3 hover:bg-[#1B2E0A]"
            >
              <Icons.Twitter />
            </a>
          </div>
        </PaintFrame>

        {/* TOKEN CA BANNER */}
        <PaintFrame variant="accent" className="animate-pulse-glow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[#2F3E1C]">
              <Icons.Coin />
              <span className="font-bold">Contract Address:</span>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-center">
              <code className="font-mono text-sm bg-[#2F3E1C]/10 px-3 py-1 rounded break-all text-[#2F3E1C]">
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
            icon={<Icons.ImageIcon />}
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
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2F3E1C]/20">
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
                  <Icons.Activity />
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
              <h3 className="font-bold mb-6 flex items-center gap-2 text-xl">
                <Icons.ImageIcon />
                Normie Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                {GALLERY_ITEMS.map((item, i) => (
                  <GalleryItem key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden paint-frame animate-float-slow">
                  <img src="/logo.png" alt="NormieOS" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold">What is {CONFIG.name}?</h2>
              </div>

              <PaintFrame variant="default" className="text-[#E8F5E9]">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icons.Zap /> AI-Powered Trading
                </h3>
                <p>
                  {CONFIG.name} is an AI-powered trading bot that monitors new memecoins on Solana.
                  It analyzes each token using advanced AI and automatically executes trades based on the analysis.
                </p>
              </PaintFrame>

              <PaintFrame variant="accent" className="text-[#2F3E1C]">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icons.Target /> How It Works
                </h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Bot monitors Pump.fun for new tokens</li>
                  <li>AI analyzes narrative, ticker, and image</li>
                  <li>Scores above threshold trigger auto-buy</li>
                  <li>Positions are managed with TP/SL</li>
                  <li>All trades shown live on this dashboard</li>
                </ol>
              </PaintFrame>

              <PaintFrame variant="light" className="text-[#2F3E1C]">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icons.Wallet /> Support the Bot
                </h3>
                <p className="mb-3">Send SOL to fund the trading wallet:</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-[#2F3E1C]/10 px-3 py-2 rounded flex-1 break-all">
                    {CONFIG.walletAddress}
                  </code>
                  <CopyButton text={CONFIG.walletAddress} label="Copy" />
                </div>
              </PaintFrame>

              <div className="text-center text-sm text-[#2F3E1C]/60">
                <p>Not financial advice. Trade at your own risk.</p>
                <p className="mt-1">2024 {CONFIG.name} - All memes reserved</p>
              </div>
            </div>
          )}
        </PaintFrame>

        {/* FOOTER */}
        <div className="text-center text-sm text-[#2F3E1C]/60 pb-4 flex items-center justify-center gap-2">
          <span>Built with</span>
          <Icons.Coffee />
          <span>by normies, for normies</span>
        </div>
      </div>
    </div>
  )
}
