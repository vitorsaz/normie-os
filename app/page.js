'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  name: 'NormieOS',
  tagline: 'For the normies, by the normies',
  tokenCA: '', // To be announced
  twitter: 'https://x.com/NormieOS_',
  walletAddress: 'NRMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  // Trading simulation config
  initialBalance: 1.0, // Starting with 1 SOL
  buyAmount: 0.02, // SOL per trade
  minScoreToBuy: 70, // Minimum AI score to trigger buy
  takeProfitPercent: 50, // TP at 50% gain
  stopLossPercent: 30, // SL at 30% loss
  maxPositions: 5, // Max simultaneous positions
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
// AI SCORING FUNCTION (Simulated)
// ═══════════════════════════════════════════════════════════════
const calculateAIScore = (token) => {
  let score = 50 // Base score

  const name = (token.name || '').toLowerCase()
  const symbol = (token.symbol || '').toLowerCase()

  // Meme keywords boost
  const memeKeywords = ['pepe', 'doge', 'shib', 'moon', 'elon', 'trump', 'wojak', 'chad', 'based', 'giga', 'ai', 'gpt', 'inu', 'cat', 'dog', 'frog', 'meme', 'pump', 'rich', 'lambo', 'ape', 'monkey', 'rocket', 'diamond', 'hands', 'wagmi', 'gm', 'ser', 'anon']

  for (const keyword of memeKeywords) {
    if (name.includes(keyword) || symbol.includes(keyword)) {
      score += 8
    }
  }

  // Symbol length bonus (shorter = better)
  if (symbol.length <= 4) score += 10
  else if (symbol.length <= 6) score += 5

  // Has image bonus
  if (token.image_uri || token.uri) score += 5

  // Random factor for variety
  score += Math.floor(Math.random() * 20) - 10

  // Clamp between 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

// ═══════════════════════════════════════════════════════════════
// GALLERY ITEMS (Static)
// ═══════════════════════════════════════════════════════════════
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
  Live: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4"/>
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  WifiOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <line x1="12" y1="20" x2="12.01" y2="20"/>
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
    <p className="mt-2 text-[#C8E6C9] opacity-80 animate-blink">Connecting to Pump.fun...</p>
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
    CONNECTING: 'bg-blue-400 text-blue-900',
    analyzing: 'bg-blue-400 text-blue-900',
    approved: 'bg-green-400 text-green-900',
    rejected: 'bg-red-400 text-red-900',
    holding: 'bg-purple-400 text-purple-900',
    sold_tp: 'bg-green-300 text-green-900',
    sold_sl: 'bg-red-300 text-red-900',
    new: 'bg-cyan-400 text-cyan-900',
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
      {/* Token Image */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2F3E1C]/10 flex-shrink-0">
        {trade.image ? (
          <img src={trade.image} alt={trade.symbol} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2F3E1C]/40">
            <Icons.Coin />
          </div>
        )}
      </div>
      <span className={`px-2 py-1 rounded font-bold text-xs flex items-center gap-1 ${
        trade.tipo === 'BUY' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
      }`}>
        {trade.tipo === 'BUY' ? <Icons.TrendUp /> : <Icons.TrendDown />}
        {trade.tipo}
      </span>
      <div>
        <span className="font-bold">{trade.symbol}</span>
        <span className="text-sm text-[#2F3E1C]/70 ml-2 hidden sm:inline">{trade.name?.slice(0, 20)}{trade.name?.length > 20 ? '...' : ''}</span>
      </div>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="font-mono">{trade.valor_sol?.toFixed(4)} SOL</span>
      {trade.pnl !== undefined && trade.pnl !== null && (
        <span className={trade.pnl >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(4)}
        </span>
      )}
      <span className="text-[#2F3E1C]/60 hidden sm:inline">Score: {trade.score}</span>
      <span className="text-[#2F3E1C]/50">{trade.time}</span>
      {trade.tx && (
        <a href={`https://solscan.io/tx/${trade.tx}`} target="_blank" rel="noopener noreferrer"
           className="text-[#4A5D23] hover:text-[#6B8E23]">
          <Icons.Link />
        </a>
      )}
    </div>
  </div>
)

// Token Card for Watching
const TokenCard = ({ token, index }) => (
  <div
    className="paint-frame-sm bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] p-4 hover:scale-[1.02] transition-transform animate-slide-up"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden paint-frame-sm bg-[#2F3E1C]/10">
          {token.image ? (
            <img src={token.image} alt={token.symbol} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2F3E1C]/40">
              <Icons.Coin />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg">{token.symbol}</h3>
          <p className="text-sm text-[#2F3E1C]/70">{token.name?.slice(0, 15)}{token.name?.length > 15 ? '...' : ''}</p>
        </div>
      </div>
      <StatusBadge status={token.status} />
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2F3E1C]/20">
      <div className="text-sm">
        <span className="text-[#2F3E1C]/60">Score:</span>
        <span className={`font-bold ml-1 ${token.score >= 70 ? 'text-green-600' : token.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{token.score}</span>
      </div>
      {token.currentPnl !== undefined && (
        <div className="text-sm">
          <span className="text-[#2F3E1C]/60">PnL:</span>
          <span className={`font-bold ml-1 ${token.currentPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {token.currentPnl >= 0 ? '+' : ''}{(token.currentPnl * 100).toFixed(1)}%
          </span>
        </div>
      )}
      <CopyButton text={token.ca} label="CA" />
    </div>
  </div>
)

// Live Token Card (New tokens from Pump.fun)
const LiveTokenCard = ({ token, index }) => (
  <div
    className={`paint-frame-sm p-3 hover:scale-[1.02] transition-transform animate-slide-up ${
      token.score >= CONFIG.minScoreToBuy
        ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400'
        : 'bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]'
    }`}
    style={{ animationDelay: `${index * 0.03}s` }}
  >
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#2F3E1C]/10 flex-shrink-0">
        {token.image ? (
          <img src={token.image} alt={token.symbol} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2F3E1C]/40">
            <Icons.Coin />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg truncate">{token.symbol}</h3>
          {token.isNew && <span className="px-1.5 py-0.5 bg-cyan-400 text-cyan-900 text-xs rounded animate-pulse">NEW</span>}
        </div>
        <p className="text-sm text-[#2F3E1C]/70 truncate">{token.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-sm font-bold ${token.score >= 70 ? 'text-green-600' : token.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            Score: {token.score}
          </span>
          <span className="text-xs text-[#2F3E1C]/50">{token.time}</span>
        </div>
      </div>
      {token.score >= CONFIG.minScoreToBuy && (
        <div className="text-green-600 animate-pulse">
          <Icons.TrendUp />
        </div>
      )}
    </div>
  </div>
)

// Gallery Item with fancy frame
const GalleryItem = ({ item, index }) => (
  <div
    className="group relative animate-slide-up"
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    <div className="absolute -inset-2 bg-gradient-to-br from-[#4A5D23] via-[#6B8E23] to-[#8FBC8F] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
    <div className="relative bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl overflow-hidden border-4 border-[#2F3E1C] shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-[1.02]">
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#4A5D23]"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#4A5D23]"></div>
      <div className="absolute bottom-8 left-1 w-3 h-3 border-b-2 border-l-2 border-[#4A5D23]"></div>
      <div className="absolute bottom-8 right-1 w-3 h-3 border-b-2 border-r-2 border-[#4A5D23]"></div>
      <div className="aspect-square overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
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
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING')

  // Trading state
  const [balance, setBalance] = useState(CONFIG.initialBalance)
  const [totalPnl, setTotalPnl] = useState(0)
  const [trades, setTrades] = useState([])
  const [positions, setPositions] = useState([]) // Current holdings
  const [liveTokens, setLiveTokens] = useState([]) // New tokens from Pump.fun
  const [stats, setStats] = useState({ total: 0, wins: 0, losses: 0 })

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const positionsRef = useRef([])
  const balanceRef = useRef(CONFIG.initialBalance)

  // Keep refs in sync
  useEffect(() => {
    positionsRef.current = positions
  }, [positions])

  useEffect(() => {
    balanceRef.current = balance
  }, [balance])

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  // Execute simulated buy
  const executeBuy = useCallback((token) => {
    if (balanceRef.current < CONFIG.buyAmount) return
    if (positionsRef.current.length >= CONFIG.maxPositions) return
    if (positionsRef.current.find(p => p.ca === token.mint)) return

    const buyPrice = 1 // Normalized starting price
    const newPosition = {
      ...token,
      ca: token.mint,
      buyPrice,
      currentPrice: buyPrice,
      buyAmount: CONFIG.buyAmount,
      buyTime: new Date(),
      status: 'holding',
      currentPnl: 0,
    }

    setPositions(prev => [...prev, newPosition])
    setBalance(prev => prev - CONFIG.buyAmount)

    // Add trade to history
    const newTrade = {
      id: Date.now(),
      symbol: token.symbol,
      name: token.name,
      image: token.image,
      tipo: 'BUY',
      valor_sol: CONFIG.buyAmount,
      score: token.score,
      time: 'now',
      timestamp: new Date(),
      ca: token.mint,
    }
    setTrades(prev => [newTrade, ...prev].slice(0, 50))
    setStats(prev => ({ ...prev, total: prev.total + 1 }))
  }, [])

  // Simulate price movements and check TP/SL
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        const updated = []
        const toSell = []

        for (const pos of prev) {
          // Simulate price movement (-10% to +15% per tick, with slight upward bias for high scores)
          const scoreBias = (pos.score - 50) / 500 // High score = slight positive bias
          const priceChange = (Math.random() - 0.45 + scoreBias) * 0.15
          const newPrice = pos.currentPrice * (1 + priceChange)
          const pnlPercent = (newPrice - pos.buyPrice) / pos.buyPrice

          // Check TP/SL
          if (pnlPercent >= CONFIG.takeProfitPercent / 100) {
            toSell.push({ ...pos, currentPrice: newPrice, currentPnl: pnlPercent, sellReason: 'TP' })
          } else if (pnlPercent <= -CONFIG.stopLossPercent / 100) {
            toSell.push({ ...pos, currentPrice: newPrice, currentPnl: pnlPercent, sellReason: 'SL' })
          } else {
            updated.push({ ...pos, currentPrice: newPrice, currentPnl: pnlPercent })
          }
        }

        // Process sells
        for (const pos of toSell) {
          const pnlSol = pos.buyAmount * pos.currentPnl
          const returnAmount = pos.buyAmount + pnlSol

          setBalance(b => b + returnAmount)
          setTotalPnl(p => p + pnlSol)
          setStats(s => ({
            ...s,
            total: s.total + 1,
            wins: pos.currentPnl >= 0 ? s.wins + 1 : s.wins,
            losses: pos.currentPnl < 0 ? s.losses + 1 : s.losses,
          }))

          const sellTrade = {
            id: Date.now() + Math.random(),
            symbol: pos.symbol,
            name: pos.name,
            image: pos.image,
            tipo: 'SELL',
            valor_sol: returnAmount,
            score: pos.score,
            pnl: pnlSol,
            time: 'now',
            timestamp: new Date(),
            ca: pos.ca,
            reason: pos.sellReason,
          }
          setTrades(t => [sellTrade, ...t].slice(0, 50))
        }

        return updated
      })

      // Update trade times
      setTrades(prev => prev.map(t => ({
        ...t,
        time: timeAgo(t.timestamp)
      })))

      // Update live token times and remove old ones
      setLiveTokens(prev => prev
        .map(t => ({ ...t, time: timeAgo(t.timestamp), isNew: Date.now() - t.timestamp < 5000 }))
        .filter(t => Date.now() - t.timestamp < 120000) // Keep for 2 minutes
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Connect to Pump.fun WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        setConnectionStatus('CONNECTING')

        // Pump.fun WebSocket endpoint
        const ws = new WebSocket('wss://pumpportal.fun/api/data')
        wsRef.current = ws

        ws.onopen = () => {
          console.log('Connected to Pump.fun')
          setConnectionStatus('ONLINE')
          setLoading(false)

          // Subscribe to new token events
          ws.send(JSON.stringify({
            method: "subscribeNewToken"
          }))
        }

        ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data)

            // Handle new token creation
            if (data.mint) {
              const score = calculateAIScore(data)

              // Get image URL - try direct fields first
              let imageUrl = data.image_uri || data.imageUri || data.image || null

              // If no direct image, try to fetch from metadata URI
              if (!imageUrl && data.uri) {
                try {
                  // Convert IPFS URI to gateway URL
                  let metadataUrl = data.uri
                  if (metadataUrl.startsWith('ipfs://')) {
                    metadataUrl = metadataUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  }

                  // Fetch metadata JSON
                  const response = await fetch(metadataUrl)
                  if (response.ok) {
                    const metadata = await response.json()
                    imageUrl = metadata.image || metadata.image_uri || null
                  }
                } catch (fetchErr) {
                  console.log('Metadata fetch error:', fetchErr)
                }
              }

              // Convert IPFS image URLs to gateway URLs
              if (imageUrl && imageUrl.startsWith('ipfs://')) {
                imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
              }

              const newToken = {
                id: data.mint,
                mint: data.mint,
                symbol: data.symbol || 'UNKNOWN',
                name: data.name || 'Unknown Token',
                image: imageUrl,
                score,
                timestamp: new Date(),
                time: 'now',
                isNew: true,
                ca: data.mint,
              }

              console.log('New token:', data.symbol, 'Image:', imageUrl, 'Raw data:', data)

              // Add to live tokens feed
              setLiveTokens(prev => [newToken, ...prev].slice(0, 30))

              // Auto-buy if score is high enough
              if (score >= CONFIG.minScoreToBuy) {
                setTimeout(() => executeBuy(newToken), 500) // Small delay for visual effect
              }
            }
          } catch (e) {
            console.log('Parse error:', e)
          }
        }

        ws.onerror = (error) => {
          console.log('WebSocket error:', error)
          setConnectionStatus('OFFLINE')
        }

        ws.onclose = () => {
          console.log('WebSocket closed, reconnecting...')
          setConnectionStatus('RECONNECTING')
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000)
        }

      } catch (error) {
        console.log('Connection error:', error)
        setConnectionStatus('OFFLINE')
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [executeBuy])

  // Initial loading timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const winRate = stats.wins + stats.losses > 0
    ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
    : '0.0'

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <PaintFrame variant="default" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8FBC8F]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4A5D23]/30 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden paint-frame animate-bounce-slow">
                <img src="/logo.png" alt="NormieOS Logo" className="w-full h-full object-cover" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#2F3E1C] flex items-center justify-center ${
                connectionStatus === 'ONLINE' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'RECONNECTING' ? 'bg-yellow-400 animate-spin' : 'bg-red-400'
              }`}>
                {connectionStatus === 'ONLINE' ? <Icons.Wifi /> : <Icons.WifiOff />}
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#E8F5E9]">{CONFIG.name}</h1>
                <span className="animate-wiggle text-[#E8F5E9]"><Icons.Rocket /></span>
              </div>
              <p className="text-[#C8E6C9] mt-1">{CONFIG.tagline}</p>
              <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                <StatusBadge status={connectionStatus} />
                <span className="text-sm text-[#C8E6C9]/80">
                  {connectionStatus === 'ONLINE' ? 'Live from Pump.fun' : 'Connecting...'}
                </span>
                {connectionStatus === 'ONLINE' && (
                  <span className="flex items-center gap-1 text-red-400 text-sm animate-pulse">
                    <Icons.Live /> LIVE
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Balance</span>
                  <p className="font-bold text-lg text-[#E8F5E9]">{balance.toFixed(4)} SOL</p>
                </div>
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Total PNL</span>
                  <p className={`font-bold text-lg ${totalPnl >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(4)} SOL
                  </p>
                </div>
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Win Rate</span>
                  <p className="font-bold text-lg text-[#E8F5E9]">{winRate}%</p>
                </div>
                <div className="bg-[#E8F5E9]/20 rounded-lg px-3 py-2 paint-frame-sm">
                  <span className="text-xs text-[#C8E6C9]">Positions</span>
                  <p className="font-bold text-lg text-[#E8F5E9]">{positions.length}/{CONFIG.maxPositions}</p>
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

        {/* TOKEN CA BANNER - only show if CA is set */}
        {CONFIG.tokenCA && (
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
        )}

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
                  <StatusBadge status={connectionStatus} />
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.Wallet />
                    <code className="font-mono">{CONFIG.walletAddress.slice(0, 8)}...{CONFIG.walletAddress.slice(-4)}</code>
                    <CopyButton text={CONFIG.walletAddress} label="" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>Trades: <strong>{stats.total}</strong></span>
                  <span className="text-green-600">W: {stats.wins}</span>
                  <span className="text-red-600">L: {stats.losses}</span>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Live Token Feed */}
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="text-red-500 animate-pulse"><Icons.Live /></span>
                    Live Tokens ({liveTokens.length})
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {liveTokens.length === 0 ? (
                      <div className="text-center py-8 text-[#2F3E1C]/50">
                        <Icons.Activity />
                        <p className="mt-2">Waiting for new tokens...</p>
                      </div>
                    ) : (
                      liveTokens.map((token, i) => (
                        <LiveTokenCard key={token.id} token={token} index={i} />
                      ))
                    )}
                  </div>
                </div>

                {/* Trades List */}
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Icons.Activity />
                    Trade History ({trades.length})
                  </h3>
                  <div className="paint-frame-sm overflow-hidden max-h-[400px] overflow-y-auto">
                    {trades.length === 0 ? (
                      <div className="text-center py-8 text-[#2F3E1C]/50">
                        <Icons.Coffee />
                        <p className="mt-2">No trades yet...</p>
                      </div>
                    ) : (
                      trades.map((trade, i) => (
                        <TradeRow key={trade.id} trade={trade} index={i} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WATCHING TAB */}
          {activeTab === 'watching' && (
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Icons.Eye />
                Active Positions ({positions.length}/{CONFIG.maxPositions})
              </h3>
              {positions.length === 0 ? (
                <div className="text-center py-12 text-[#2F3E1C]/50">
                  <Icons.Target />
                  <p className="mt-2">No active positions</p>
                  <p className="text-sm">Waiting for tokens with score {'>='} {CONFIG.minScoreToBuy}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {positions.map((token, i) => (
                    <TokenCard key={token.ca} token={token} index={i} />
                  ))}
                </div>
              )}

              {/* Trading Settings Info */}
              <div className="mt-6 p-4 bg-[#2F3E1C]/10 rounded-lg">
                <h4 className="font-bold mb-2">Simulation Settings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#2F3E1C]/60">Buy Amount:</span>
                    <span className="font-bold ml-1">{CONFIG.buyAmount} SOL</span>
                  </div>
                  <div>
                    <span className="text-[#2F3E1C]/60">Min Score:</span>
                    <span className="font-bold ml-1">{CONFIG.minScoreToBuy}</span>
                  </div>
                  <div>
                    <span className="text-[#2F3E1C]/60">Take Profit:</span>
                    <span className="font-bold ml-1 text-green-600">+{CONFIG.takeProfitPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[#2F3E1C]/60">Stop Loss:</span>
                    <span className="font-bold ml-1 text-red-600">-{CONFIG.stopLossPercent}%</span>
                  </div>
                </div>
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
                  <Icons.Zap /> AI-Powered Trading (Simulation)
                </h3>
                <p>
                  {CONFIG.name} is an AI-powered trading bot that monitors new memecoins on Solana via Pump.fun.
                  This dashboard shows REAL tokens being created, with SIMULATED trading to test strategies.
                </p>
              </PaintFrame>

              <PaintFrame variant="accent" className="text-[#2F3E1C]">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icons.Target /> How It Works
                </h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Connects to Pump.fun WebSocket for live token data</li>
                  <li>AI analyzes each token (name, ticker, image)</li>
                  <li>Tokens scoring {'>'}= {CONFIG.minScoreToBuy} trigger simulated buy</li>
                  <li>Positions managed with {CONFIG.takeProfitPercent}% TP / {CONFIG.stopLossPercent}% SL</li>
                  <li>All trades shown live on this dashboard</li>
                </ol>
              </PaintFrame>

              <PaintFrame variant="light" className="text-[#2F3E1C]">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icons.Wallet /> Simulation Mode
                </h3>
                <p className="mb-3">
                  Currently running with <strong>{CONFIG.initialBalance} SOL</strong> simulated balance.
                  No real trades are executed - this is for testing the AI scoring system.
                </p>
                <div className="bg-yellow-100 border border-yellow-400 rounded p-2 text-sm">
                  This is a SIMULATION. Real token data, fake trades.
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
