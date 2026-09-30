"use client"

import { useState, useEffect } from "react"

const STEPS = [
  {
    num: "01",
    title: "Model Schema",
    desc: "Design the database first",
    file: "db/schema.sql",
    lang: "sql",
    code: [
      { type: "comment", text: "-- Define the users table" },
      { type: "command", text: "CREATE TABLE users (" },
      { type: "output", text: "  id UUID PRIMARY KEY," },
      { type: "output", text: "  email TEXT UNIQUE NOT NULL," },
      { type: "output", text: "  created_at TIMESTAMPTZ" },
      { type: "command", text: ");" },
      { type: "gap" },
      { type: "comment", text: "-- Index for fast lookups" },
      { type: "command", text: "CREATE INDEX ON users (email);" },
    ],
  },
  {
    num: "02",
    title: "Define API",
    desc: "TypeScript-first route handlers",
    file: "routes/users.ts",
    lang: "typescript",
    code: [
      { type: "comment", text: "// routes/users.ts" },
      { type: "keyword", text: "import", after: " { Router, db } ", keyword2: "from", string: " '@/lib/server'" },
      { type: "gap" },
      { type: "keyword", text: "const", after: " router ", keyword2: "=", keyword3: " new ", fn: "Router", args: "()" },
      { type: "gap" },
      { type: "keyword", text: "export", after: " ", keyword2: "", fn: "router", args: ".get('/users/:id', async (req) => {" },
      { type: "prop", key: "  const user", val: "await db.users.find(req.params.id)" },
      { type: "prop", key: "  return", val: "user" },
      { type: "plain", text: "})" },
    ],
  },
  {
    num: "03",
    title: "Add Cache",
    desc: "Redis for hot queries",
    file: "lib/cache.ts",
    lang: "typescript",
    code: [
      { type: "comment", text: "// Cache expensive queries with Redis" },
      { type: "keyword", text: "import", after: " { Redis } ", keyword2: "from", string: " '@/lib/redis'" },
      { type: "gap" },
      { type: "keyword", text: "const", after: " cache ", keyword2: "=", keyword3: " new ", fn: "Redis", args: "({" },
      { type: "prop", key: "  ttl", val: "60" },
      { type: "prop", key: "  namespace", val: "'users'" },
      { type: "plain", text: "})" },
      { type: "gap" },
      { type: "comment", text: "// Wrap the query" },
      { type: "plain", text: "await cache.wrap(key, fetchUser)" },
    ],
  },
  {
    num: "04",
    title: "Deploy",
    desc: "Zero-downtime shipping",
    file: "terminal",
    lang: "bash",
    code: [
      { type: "comment", text: "# Run migrations & deploy" },
      { type: "command", text: "pnpm db:migrate && pnpm deploy" },
      { type: "gap" },
      { type: "output", text: "  Applying migrations..." },
      { type: "output", text: "  Running tests..." },
      { type: "output", text: "  Deploying to edge..." },
      { type: "gap" },
      { type: "success", text: "✓ api deployed" },
      { type: "url", text: "  → /api/v1" },
    ],
  },
]

function CodeLine({ line }: { line: (typeof STEPS)[0]["code"][0] }) {
  if (line.type === "gap") return <div className="h-3" />
  if (line.type === "comment") return <div className="text-[#9ca3af] dark:text-[#6b7280]">{line.text}</div>
  if (line.type === "output") return <div className="text-[#6b7280] dark:text-[#9ca3af]">{line.text}</div>
  if (line.type === "success") return <div className="text-[#16a34a] dark:text-[#4ade80]">{line.text}</div>
  if (line.type === "url") return <div className="text-[#2563eb] dark:text-[#60a5fa] underline">{line.text}</div>
  if (line.type === "command") return (
    <div>
      <span className="text-[#16a34a] dark:text-[#4ade80]">$ </span>
      <span className="text-[#111] dark:text-[#EDECE6]">{line.text}</span>
    </div>
  )
  if (line.type === "plain") return <div className="text-[#111] dark:text-[#EDECE6]">{line.text}</div>
  if (line.type === "prop") return (
    <div>
      <span className="text-[#2563eb] dark:text-[#60a5fa]">{line.key}</span>
      <span className="text-[#111] dark:text-[#EDECE6]">: </span>
      <span className="text-[#16a34a] dark:text-[#4ade80]">{line.val}</span>
      <span className="text-[#111] dark:text-[#EDECE6]">,</span>
    </div>
  )
  if (line.type === "keyword") return (
    <div>
      <span className="text-[#7c3aed] dark:text-[#c084fc]">{line.text}</span>
      <span className="text-[#111] dark:text-[#EDECE6]">{line.after}</span>
      <span className="text-[#7c3aed] dark:text-[#c084fc]">{line.keyword2}</span>
      {line.keyword3 && <span className="text-[#7c3aed] dark:text-[#c084fc]">{line.keyword3}</span>}
      {line.fn && <span className="text-[#b45309] dark:text-[#fbbf24]">{line.fn}</span>}
      {line.args && <span className="text-[#111] dark:text-[#EDECE6]">{line.args}</span>}
      {line.string && <span className="text-[#16a34a] dark:text-[#4ade80]">{line.string}</span>}
    </div>
  )
  return null
}

export function DevExSection() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  function selectStep(i: number) {
    if (i === active) return
    setVisible(false)
    setTimeout(() => {
      setActive(i)
      setVisible(true)
    }, 180)
  }

  // Auto-advance every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActive(prev => (prev + 1) % STEPS.length)
        setVisible(true)
      }, 180)
    }, 3200)
    return () => clearInterval(t)
  }, [])

  const step = STEPS[active]

  return (
    <section id="devex" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[10px] tracking-widest text-black/40 dark:text-white/40 uppercase">
            How I Work
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
            Clean code.<br />Solid foundations.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
          {/* Left — 4 clickable step cards, equal height, no flex stretch */}
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => selectStep(i)}
                className={`flex-1 text-left rounded-2xl border transition-all duration-200 p-6 group ${
                  active === i
                    ? "bg-black/[0.04] dark:bg-white/[0.08] border-black/[0.12] dark:border-white/[0.16] shadow-xs"
                    : "bg-white/70 dark:bg-[#131418] border-black/[0.06] dark:border-white/[0.06] hover:bg-white/90 dark:hover:bg-[#18191f] shadow-xs"
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-light shrink-0 transition-colors duration-200 ${
                      active === i
                        ? "bg-black/[0.08] dark:bg-white/[0.12] text-black/70 dark:text-white/80"
                        : "bg-black/[0.04] dark:bg-white/[0.05] text-black/35 dark:text-white/35"
                    }`}
                  >
                    {s.num}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-light transition-colors duration-200 ${
                        active === i ? "text-black/80 dark:text-white/90" : "text-black/50 dark:text-white/50"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs mt-0.5 text-black/35 dark:text-white/35">{s.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right — fixed-size code panel */}
          <div className="lg:col-span-2 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#131418] p-8 flex flex-col shadow-xs min-h-[360px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div
                className="text-[10px] tracking-widest uppercase transition-all duration-200 text-black/30 dark:text-white/40"
                style={{
                  opacity: visible ? 1 : 0,
                  filter: visible ? "blur(0px)" : "blur(4px)",
                  transition: "opacity 200ms ease, filter 200ms ease",
                }}
              >
                {step.file}
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      d === active % 3 ? "bg-black/25 dark:bg-white/40" : "bg-black/[0.08] dark:bg-white/[0.1]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Code block — fixed height, content doesn't affect layout */}
            <div className="flex-1 rounded-xl p-6 overflow-hidden bg-black/[0.03] dark:bg-[#0c0d10] border border-black/[0.06] dark:border-white/[0.06]">
              <div
                className="font-mono text-[12px] leading-6"
                style={{
                  opacity: visible ? 1 : 0,
                  filter: visible ? "blur(0px)" : "blur(6px)",
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), filter 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {step.code.map((line, i) => (
                  <CodeLine key={i} line={line} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
