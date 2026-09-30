"use client"

import React, { useRef, useEffect, useState } from "react"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { DevExSection } from "@/components/devex-section"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] dark:border-white/[0.08] bg-white dark:bg-[#131418] overflow-hidden transition-all duration-700 hover:border-black/[0.15] dark:hover:border-white/[0.16] hover:bg-[#fafaf8] dark:hover:bg-[#18191f] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 dark:text-white/40 bg-black/[0.04] dark:bg-white/[0.06] border border-transparent dark:border-white/[0.05]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AgenticPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroMounted, setHeroMounted] = useState(false)
  const [fadeActive, setFadeActive] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Smooth slow cinematic open fade and simultaneous video zoom in
  useEffect(() => {
    const tZoom = setTimeout(() => setHeroMounted(true), 60)
    const tFade = setTimeout(() => setFadeActive(false), 1600)
    if (typeof window !== "undefined" && window.location.hash === "#home") {
      window.scrollTo({ top: 0, behavior: "instant" })
      window.history.replaceState(null, "", window.location.pathname)
    }
    return () => {
      clearTimeout(tZoom)
      clearTimeout(tFade)
    }
  }, [])

  // Force DOM property muted = true and trigger autoplay reliably across all mobile & desktop browsers
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.defaultMuted = true
    vid.muted = true
    vid.setAttribute("playsinline", "true")
    vid.setAttribute("webkit-playsinline", "true")

    const tryPlay = () => {
      if (vid.paused) {
        const p = vid.play()
        if (p !== undefined) {
          p.catch(() => {})
        }
      }
    }

    tryPlay()
    // In case mobile OS power-save or strict policy pauses autoplay until first interaction
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true })
    window.addEventListener("click", tryPlay, { once: true, passive: true })
    return () => {
      window.removeEventListener("touchstart", tryPlay)
      window.removeEventListener("click", tryPlay)
    }
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] dark:bg-[#0C0D10] text-[#111] dark:text-[#EDECE6] min-h-screen font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

      {/* ── SMOOTH SLOW PAGE OPEN FADE ANIMATION ──────────────────────────── */}
      {fadeActive && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none bg-[#F5F4F0] dark:bg-[#0C0D10]"
          style={{
            animation: "pageSmoothFadeOut 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
          aria-hidden="true"
        />
      )}

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO / HOME ─────────────────────────────────────────────────── */}
      <section id="home" className="relative h-screen overflow-hidden scroll-mt-24">
        <div id="hero" className="absolute top-0 pointer-events-none" />

        {/* Video background — zooms in smoothly from 0.95 to 1.00 as page opens */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero_poster.jpg"
          className="absolute inset-0 w-full h-[62vh] md:h-[75vh] object-cover object-[center_35%] z-0 [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]"
          style={{
            transform: heroMounted ? "scale(1.00) translateZ(0)" : "scale(0.95) translateZ(0)",
            transition: "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
          onError={() => {
            const vid = videoRef.current
            if (vid && !vid.currentSrc.endsWith("/hero.mp4")) {
              vid.src = "/hero.mp4"
              vid.load()
              vid.play().catch(() => {})
            }
          }}
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Progressive blur + light/dark gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none dark:hidden" style={{ height: "46%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 15%, rgba(245,244,240,0.85) 30%, rgba(245,244,240,0.35) 55%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none hidden dark:block" style={{ height: "46%", background: "linear-gradient(to top, #0C0D10 0%, #0C0D10 15%, rgba(12,13,16,0.85) 30%, rgba(12,13,16,0.35) 55%, transparent 100%)" }} />

        {/* Backdrop blur layers — subtle blur only at the very bottom where text sits */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "18%", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "28%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Title with word reveal glitch effect */}
          <RevealText
            as="h1"
            className="text-6xl sm:text-7xl md:text-8xl font-light text-[#111] dark:text-[#EDECE6] leading-[1.0] tracking-tight mb-10"
            delay={300}
            stagger={90}
            duration={800}
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
            }}
          >
            {"Backends that\nscale. APIs\nthat never\nsleep."}
          </RevealText>

          {/* 3 metrics — smooth staggered reveal after title */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "40+", label: "Projects" },
              { value: "99.9%", label: "Uptime" },
              { value: "12ms", label: "Avg Latency" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroMounted ? 1 : 0,
                  filter: heroMounted ? "blur(0px)" : "blur(12px)",
                  transform: heroMounted ? "translateY(0px)" : "translateY(16px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${700 + i * 90}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${700 + i * 90}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${700 + i * 90}ms`,
                }}
              >
                <div className="text-3xl sm:text-4xl text-[#111] dark:text-[#EDECE6] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 dark:text-white/40 tracking-widest uppercase mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM / SKILLS (bento) ────────────────────────────────────── */}
      <section id="skills" className="py-32 px-6 md:px-12 lg:px-20 scroll-mt-24">
        <div id="platform" className="relative -top-24 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>SKILLS</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
              {"Everything from schema\nto shipped API."}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-3" onMouseMove={handleMouse}>
            {/* Big left card — full width now that multi-agent is removed */}
            <BentoCard className="col-span-12 p-8 min-h-[200px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              {/* Arc background image — always fills container, objects pushed to bottom third */}
              <img
                src="/images/arc.png"
                alt=""
                aria-hidden="true"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 70%" }}
              />
              {/* Progressive blur layer — blurs from 45% downward */}
              <div className="absolute inset-0" style={{
                maskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }} />
              {/* Fade-to-background gradient — matches site bg color #f5f4f0 in light, #131418 in dark */}
              <div
                className="absolute inset-0 dark:hidden"
                style={{
                  background: "linear-gradient(to bottom, transparent 35%, rgba(245,244,240,0.3) 50%, rgba(245,244,240,0.75) 65%, rgba(245,244,240,0.95) 80%, rgb(245,244,240) 100%)",
                }}
              />
              <div
                className="absolute inset-0 hidden dark:block"
                style={{
                  background: "linear-gradient(to bottom, transparent 35%, rgba(19,20,24,0.3) 50%, rgba(19,20,24,0.75) 65%, rgba(19,20,24,0.95) 80%, rgb(19,20,24) 100%)",
                }}
              />
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 flex items-center justify-center mb-6 text-[#111] dark:text-white/80" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-[#111] dark:text-[#EDECE6]">API Architecture</h3>
                <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed max-w-sm">
                  REST and GraphQL APIs designed for scale. Clean contracts, versioning, rate limiting, and docs that stay in sync with the code.
                </p>
              </div>
            </BentoCard>

            {/* Bottom row */}
            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={120}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5 text-[#111] dark:text-white/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2 text-[#111] dark:text-[#EDECE6]">Observability</h3>
              <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed">Structured logs, metrics, and tracing. Find and fix issues before users notice them.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={160}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5 text-[#111] dark:text-white/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2 text-[#111] dark:text-[#EDECE6]">Database Design</h3>
              <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed">Normalized schemas, smart indexing, and query tuning across Postgres, MySQL, and Redis.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={200}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5 text-[#111] dark:text-white/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2 text-[#111] dark:text-[#EDECE6]">Auth & Security</h3>
              <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed">JWT, OAuth2, and role-based access. Parameterized queries and hardened endpoints by default.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── PROJECTS / AGENTS (4 cards) ──────────────────────────────────── */}
      <section id="projects" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
        <div id="agents" className="relative -top-24 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>PROJECTS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
                {"Systems I've designed\nand shipped."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed max-w-xs">
              A selection of backends I've built end to end — from data model to deployed API. Every one is versioned, tested, and observable.
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── PROCESS / WORKFLOW ───────────────────────────────────────────── */}
      <section id="process" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] overflow-hidden scroll-mt-24">
        <div id="workflow" className="relative -top-24 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>PROCESS</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
              {"From idea to production\nin four steps."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "Design",  desc: "Map out the data model, endpoints, and access patterns before a line of code is written.", delay: 0,   img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/define-5aafAmGBrxZpOqJ3XLHY3n3qzC2I5K.png" },
              { n: "02", title: "Build",   desc: "Implement typed services, migrations, and endpoints with clean, testable architecture.", delay: 80,  img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compose-5RT5VR4f1Y3GoFmovqTKLTG4UXp3g2.png" },
              { n: "03", title: "Test",    desc: "Unit, integration, and load tests. Verify correctness and performance under real traffic.", delay: 140, img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-zm8guZwxJHtwWsJ7XO4B0CF7GzlNK8.png" },
              { n: "04", title: "Deploy",  desc: "Ship with CI/CD, zero-downtime migrations, and monitoring wired in from day one.", delay: 200, img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deploy-an8fgHSLzniojkcmRyGGIFQUJF9T5J.png" },
            ].map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={step.delay}>
                {/* Image at top — mask fades it out strongly before the bottom edge */}
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <img
                    src={step.img}
                    alt={step.title}
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
                {/* Number top-left */}
                <div className="relative z-10 p-7">
                  <span className="font-pixel text-[11px] text-black/20 dark:text-white/30 tracking-widest block">{step.n}</span>
                </div>
                {/* Text pushed further down */}
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3 text-[#111] dark:text-[#EDECE6]">{step.title}</h3>
                  <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK / INTEGRATIONS ────────────────────────────────────────── */}
      <section id="stack" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
        <div id="integrations" className="relative -top-24 pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>STACK</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
                {"Any database.\nAny protocol."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed max-w-xs">
              Node, TypeScript, Go, and Python. Postgres, MySQL, Redis, and Mongo. REST, GraphQL, gRPC, and WebSockets — wired together cleanly.
            </p>
          </div>

          {/* Full-width image block with glass cards */}
          {/* Mobile: flex-col, image + cards stacked. Desktop: image fills block, cards absolute */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.07] dark:border-white/[0.08] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Image */}
            <div className="relative w-full h-[280px] md:h-[480px] shrink-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Org%20Arc%20-%20Upscaled-Sk90jShfu7nltLnhoQbaMJC1YaQKuU.png"
                alt="Agent orchestration architecture"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Cards — flex row on mobile (equal spacing), absolute on desktop */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 dark:border-white/[0.1] p-6 bg-white/60 dark:bg-[#131418]/85 backdrop-blur-xl"
              >
                <Tag>API</Tag>
                <h3 className="mt-3 text-lg font-light mb-2 text-[#111] dark:text-[#EDECE6]">Typed endpoints</h3>
                <p className="text-xs text-black/45 dark:text-white/50 leading-relaxed mb-4">End-to-end type safety from database to response. TypeScript and Zod.</p>
                <div className="bg-black/[0.05] dark:bg-black/50 rounded-lg border border-black/[0.07] dark:border-white/[0.08] p-3 font-mono text-[11px] text-black/50 dark:text-white/60 leading-relaxed">
                  <span className="text-black/25 dark:text-white/30">// route handler</span><br />
                  <span className="text-blue-600/70 dark:text-blue-400">router</span>.get({"("}<span className="text-green-700/70 dark:text-green-400">&apos;/users/:id&apos;</span>,<br />
                  {"  "}<span className="text-black/35 dark:text-white/40">async (req, res) </span>={">"}<br />
                  {"    "}<span className="text-blue-600/70 dark:text-blue-400">db</span>.users.find(req.params.id)<br />
                  {"  )"}<br />
                  {")"}
                </div>
              </div>

              <div
                className="rounded-xl border border-white/50 dark:border-white/[0.1] p-6 bg-white/60 dark:bg-[#131418]/85 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-xs text-black/40 dark:text-white/45 tracking-widest">LIVE API</span>
                </div>
                <p className="text-sm text-black/45 dark:text-white/50">Full REST + WebSocket APIs. Real-time data streamed straight into your product.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & OBSERVABILITY ──────────────────────────────────────── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>RELIABILITY</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
              {"Production-grade\nfrom day one."}
            </RevealText>
          </div>

          {/* Asymmetric grid: left text + title, right interactive audit log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side — descriptions */}
            <div className="space-y-6">
              <p className="text-sm text-black/45 dark:text-white/50 leading-relaxed">
                Every request is logged, every query is traceable. Built for systems that can&apos;t afford downtime or data loss.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Automated Backups", desc: "Point-in-time recovery and daily snapshots" },
                  { label: "Full Request Tracing", desc: "Every request logged with end-to-end traceability" },
                  { label: "Real-time Monitoring", desc: "Alerts, dashboards, and replayable error logs" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-1 bg-black/10 dark:bg-white/10 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-sm font-light mb-1 text-[#111] dark:text-[#EDECE6]">{item.label}</h3>
                      <p className="text-xs text-black/35 dark:text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance badges — vertical stack */}
              <div className="pt-4 flex flex-col gap-2">
                {["99.9% Uptime", "Zero-downtime deploys", "Rate limiting", "Encrypted at rest"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs text-black/25 dark:text-white/35">
                    <span className="w-1 h-1 rounded-full bg-black/25 dark:bg-white/35" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live audit log visualization */}
            <BentoCard className="p-6 lg:row-span-1" delay={0}>
              <div className="text-xs text-black/30 dark:text-white/40 tracking-widest uppercase mb-4">Live Audit Trail</div>
              <div className="space-y-2">
                {[
                  { time: "12:34:21", action: "POST /api/orders 201", status: "success" },
                  { time: "12:34:18", action: "db.query committed", status: "success" },
                  { time: "12:34:15", action: "cache.set hit", status: "success" },
                  { time: "12:34:12", action: "auth.token verified", status: "success" },
                  { time: "12:34:09", action: "GET /api/users 200", status: "success" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors border border-black/[0.04] dark:border-white/[0.06] group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                    }}
                  >
                    <span className="text-[10px] text-black/25 dark:text-white/30 font-mono min-w-[60px]">{log.time}</span>
                    <span className="text-[11px] text-black/50 dark:text-white/60 font-light flex-1">{log.action}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-colors" />
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER EXPERIENCE ──────────────────────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE CAPABILITIES ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] dark:border-white/[0.08] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06] dark:border-white/[0.08]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Web Scraping", "Data Pipelines", "API Engineering", "Web Research", "Database Design", "PR Reviews", "SQL Queries", "File Processing", "Monitoring"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] dark:border-white/[0.08] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/25 shrink-0" />
                  <span className="text-sm text-black/45 dark:text-white/55 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Scraper Automation", "Report Writing", "Lead Scoring", "Log Parsing", "Test Running", "Deployment", "Invoice Processing", "Sentiment Analysis"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] dark:border-white/[0.08] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 dark:bg-white/15 shrink-0" />
                  <span className="text-sm text-black/30 dark:text-white/35 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ───────────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>LIVE RIGHT NOW</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
                {"Services running\n24 / 7, autonomously."}
              </RevealText>
              <p className="mt-6 text-base text-black/40 dark:text-white/50 leading-relaxed max-w-sm">
                At any moment, the backends and data pipelines I build are handling requests, running jobs, and syncing data — quietly, reliably, around the clock.
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 dark:text-white/40 text-sm mb-1 tracking-wide">requests per minute</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES / PRICING ───────────────────────────────────────────── */}
      <section id="services" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-24">
        <div id="pricing" className="relative -top-24 pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <PixelIcon type="pricing" size={40} />
            <div className="mt-4"><Tag>SERVICES</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-[#111] dark:text-white">
              {"Ways we can work together."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" onMouseMove={handleMouse}>
            {[
              {
                name: "Consult",
                price: "Free",
                sub: "Intro chat & scoping",
                features: ["30-min discovery chat", "Architecture review", "Tech stack advice", "Project estimate"],
                delay: 0,
              },
              {
                name: "Build",
                price: "Project",
                sub: "End-to-end delivery",
                features: ["API & database design", "Web scraping & data pipelines", "Full implementation", "Tests + CI/CD", "Docs & handover", "Deployment included"],
                highlight: true,
                delay: 80,
              },
              {
                name: "Retainer",
                price: "Monthly",
                sub: "Ongoing partnership",
                features: ["Dedicated hours", "Priority response", "Scraper monitoring & updates", "Maintenance & scaling", "Feature development", "Flexible contract"],
                delay: 140,
              },
            ].map((plan) => (
              <BentoCard
                key={plan.name}
                className={`p-8 flex flex-col ${plan.highlight ? "border-black/20 dark:border-white/20 bg-[#F0EEE8] dark:bg-[#1b1c22]" : ""}`}
                delay={plan.delay}
              >
                <div className="mb-8">
                  <div className="font-pixel text-[11px] tracking-widest text-black/40 dark:text-white/40 mb-4">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-light text-[#111] dark:text-[#EDECE6]">{plan.price}</span>
                    {plan.period && <span className="text-black/40 dark:text-white/40 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-black/35 dark:text-white/40 tracking-wide">{plan.sub}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-black/55 dark:text-white/60">
                      <div className="w-1 h-1 rounded-full bg-black/25 dark:bg-white/30 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.name === "Consult" ? "https://wa.me/601127656750" : "mailto:spytherispro@gmail.com"}
                  target={plan.name === "Consult" ? "_blank" : undefined}
                  rel={plan.name === "Consult" ? "noopener noreferrer" : undefined}
                  aria-label={plan.name === "Consult" ? "Send Us a Message on WhatsApp: +60 11-2765 6750" : "Get In Touch via Email: spytherispro@gmail.com"}
                  title={plan.name === "Consult" ? "WhatsApp: +60 11-2765 6750" : "Email: spytherispro@gmail.com"}
                  className={`block text-center w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 cursor-pointer ${
                    plan.highlight
                      ? "bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-[#333] dark:hover:bg-zinc-200"
                      : "border border-black/10 dark:border-white/15 text-black/60 dark:text-white/70 hover:border-black/25 dark:hover:border-white/30 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {plan.name === "Consult" ? "SEND US A MESSAGE" : "GET IN TOUCH"}
                </a>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="relative py-20 sm:py-32 px-5 sm:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08] overflow-hidden scroll-mt-24">
        {/* Glass panels image — only in light mode */}
        <img
          src="/images/footer.png"
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none dark:hidden"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom in light mode */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Light mode color fade */}
        <div
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        {/* Dark mode subtle ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none hidden dark:block"
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.035) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-4 sm:mb-6 text-[#111] dark:text-[#EDECE6]">
            Let&apos;s build your<br />backend.
          </h2>
          <p className="text-xs sm:text-sm text-black/50 dark:text-white/60 leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
            Have an API, database, web scraper, or system that needs building or scaling? Drop your email and let&apos;s talk.
          </p>
          {!submitted ? (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto w-full"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/95 dark:bg-[#15161C] border border-black/10 dark:border-white/15 rounded-xl px-4 py-3.5 text-sm text-[#111] dark:text-[#EDECE6] placeholder:text-black/35 dark:placeholder:text-white/40 focus:outline-none focus:border-black/30 dark:focus:border-white/40 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#111] dark:bg-white text-white dark:text-[#111] text-sm rounded-xl hover:bg-[#222] dark:hover:bg-zinc-200 transition-all tracking-widest font-medium cursor-pointer shadow-xs active:scale-[0.98]"
              >
                JOIN
              </button>
            </form>
          ) : (
            <p
              className="text-center text-sm font-medium text-[#111] dark:text-[#EDECE6] py-3.5 tracking-wide"
              style={{
                animation: "fadeInThanks 0.8s ease-out forwards",
              }}
            >
              {"Thanks! I'll get back to you soon."}
            </p>
          )}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-pixel text-xs tracking-[0.25em] text-black/50 dark:text-white/60">SPYTHER</span>

          {/* Nav sections */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Home",     href: "#home" },
              { label: "Skills",   href: "#skills" },
              { label: "Projects", href: "#projects" },
              { label: "Process",  href: "#process" },
              { label: "Stack",    href: "#stack" },
              { label: "Live",     href: "#live" },
              { label: "Services", href: "#services" },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  if (l.href === "#home" || l.href === "#hero") {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: "smooth" })
                    if (window.location.hash) {
                      window.history.pushState(null, "", window.location.pathname)
                    }
                  } else {
                    e.preventDefault()
                    const target = (document.querySelector(l.href) || document.getElementById(l.href.replace("#", ""))) as HTMLElement | null
                    if (target) {
                      const navOffset = 72
                      const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset
                      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" })
                      window.history.pushState(null, "", l.href)
                    }
                  }
                }}
                className="text-xs text-black/35 dark:text-white/40 hover:text-black/70 dark:hover:text-white/80 transition-colors tracking-widest cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://t.me/spyther8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/25 dark:text-white/35 hover:text-black/55 dark:hover:text-white/70 transition-colors tracking-widest"
            >
              Telegram: @spyther8
            </a>
            <a
              href="https://wa.me/601127656750"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/25 dark:text-white/35 hover:text-black/55 dark:hover:text-white/70 transition-colors tracking-widest"
            >
              WhatsApp: +60 11-2765 6750
            </a>
            <a
              href="mailto:spytherispro@gmail.com"
              className="text-xs text-black/25 dark:text-white/35 hover:text-black/55 dark:hover:text-white/70 transition-colors tracking-widest"
            >
              spytherispro@gmail.com
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-xs text-black/20 dark:text-white/25">© 2026 Spyther. Backend, API &amp; database developer.</span>
        </div>
      </footer>
    </div>
  )
}
