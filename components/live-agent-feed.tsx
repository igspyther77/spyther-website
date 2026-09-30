"use client"

import { useEffect, useState, useRef } from "react"

const AGENT_NAMES = [
  "api-gateway", "auth-svc", "orders-svc", "users-svc",
  "payments-svc", "cron-worker", "cache-node", "queue-worker",
  "search-svc", "notify-svc",
]

const TASKS = [
  "POST /api/orders → 201 Created",
  "Scraping product catalog — 4.8k items",
  "Running scheduled DB backup",
  "Processing Stripe webhook payload",
  "GET /api/users/:id → 200 OK",
  "Extracting competitor pricing data",
  "Rebuilding search index — 12k rows",
  "Refreshing Redis cache layer",
  "Migrating schema v14 → v15",
  "Rotating JWT signing keys",
  "Aggregating hourly metrics",
  "Streaming events to consumers",
  "Validating inbound payloads",
  "Rate-limiting 4.2k requests/min",
  "Syncing replica to primary DB",
  "Purging expired sessions",
]

const REGIONS = ["us-east", "eu-west", "ap-south", "us-west", "eu-central"]
const STATUSES = [
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "queued",   color: "#facc15" },
  { label: "complete", color: "#60a5fa" },
]

type AgentRow = {
  id: string
  name: string
  task: string
  region: string
  status: typeof STATUSES[number]
  progress: number
  elapsed: string
  key: number
}

function randomRow(key: number): AgentRow {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
    task: TASKS[Math.floor(Math.random() * TASKS.length)],
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    progress: Math.floor(Math.random() * 85 + 10),
    elapsed: `${Math.floor(Math.random() * 14 + 1)}m ${Math.floor(Math.random() * 59)}s`,
    key,
  }
}

// Animated progress bar that slowly ticks forward
function ProgressBar({ initial }: { initial: number }) {
  const [pct, setPct] = useState(initial)
  const rafRef = useRef<number>(0)
  const pctRef = useRef(initial)

  useEffect(() => {
    const tick = () => {
      pctRef.current = Math.min(99, pctRef.current + 0.015)
      setPct(Math.round(pctRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="w-full h-[2px] bg-black/[0.08] dark:bg-white/[0.1] rounded-full">
      <div
        className="h-full rounded-full bg-black/35 dark:bg-white/40 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// Stable seed rows — same on server and client, no random values
const SEED_ROWS: AgentRow[] = [
  { id: "A1B2C3", name: "orders-svc",    task: "POST /api/orders → 201 Created",      region: "us-east",    status: STATUSES[0], progress: 42, elapsed: "3m 12s", key: 0 },
  { id: "D4E5F6", name: "cron-worker",   task: "Scraping product catalog — 4.8k items", region: "eu-west",  status: STATUSES[0], progress: 67, elapsed: "7m 48s", key: 1 },
  { id: "G7H8I9", name: "search-svc",    task: "Rebuilding search index — 12k rows",  region: "us-west",    status: STATUSES[3], progress: 18, elapsed: "1m 05s", key: 2 },
  { id: "J0K1L2", name: "users-svc",     task: "Migrating schema v14 → v15",          region: "eu-central", status: STATUSES[0], progress: 55, elapsed: "5m 30s", key: 3 },
  { id: "M3N4O5", name: "auth-svc",      task: "Rotating JWT signing keys",           region: "ap-south",   status: STATUSES[0], progress: 80, elapsed: "11m 22s", key: 4 },
  { id: "P6Q7R8", name: "cache-node",    task: "Refreshing Redis cache layer",        region: "us-east",    status: STATUSES[4], progress: 99, elapsed: "14m 01s", key: 5 },
]

export function LiveAgentFeed() {
  const [rows, setRows] = useState<AgentRow[]>(SEED_ROWS)
  const [mounted, setMounted] = useState(false)
  const keyRef = useRef(100)

  useEffect(() => {
    // Hydrate with random data only after client mount
    setMounted(true)
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))

    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden bg-white/70 dark:bg-[#131418] shadow-xs">
      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_80px_70px] px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03]">
        {["SERVICE", "TASK", "REGION", "STATUS"].map(h => (
          <span key={h} className="text-[8px] tracking-[0.16em] text-black/30 dark:text-white/35 font-mono">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="grid grid-cols-[80px_1fr_80px_70px] px-4 py-2.5 border-b border-black/[0.04] dark:border-white/[0.04] gap-2 items-center"
            style={{
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
            }}
          >
            {/* Agent */}
            <div>
              <div className="text-[9px] font-mono text-black/65 dark:text-white/75 mb-px">{row.name}</div>
              <div className="text-[7.5px] font-mono text-black/25 dark:text-white/30">#{row.id}</div>
            </div>

            {/* Task + progress */}
            <div className="min-w-0">
              <div className="text-[9px] text-black/50 dark:text-white/60 leading-[1.35] mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">{row.task}</div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Region */}
            <div className="text-[8px] font-mono text-black/30 dark:text-white/35">{row.region}</div>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: row.status.color,
                boxShadow: row.status.label === "running" ? `0 0 6px ${row.status.color}` : "none",
                animation: row.status.label === "running" ? "statusPulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              <span className="text-[8px] font-mono text-black/35 dark:text-white/40">{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export function LiveAgentCounter() {
  const [count, setCount] = useState(3847)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="font-mono text-5xl sm:text-6xl font-light text-black/85 dark:text-white/90 leading-none tracking-tight transition-colors duration-300">
      {mounted ? count.toLocaleString("en-US") : "3,847"}
    </span>
  )
}
