"use client"

import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

const NAV_LINKS = [
  { label: "Home",     href: "#home" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Process",  href: "#process" },
  { label: "Stack",    href: "#stack" },
  { label: "Services", href: "#services" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    if (href === "#" || href === "#home" || href === "#hero") {
      window.scrollTo({ top: 0, behavior: "instant" })
      if (window.location.hash) {
        window.history.pushState(null, "", window.location.pathname)
      }
      return
    }
    const target = (document.querySelector(href) || document.getElementById(href.replace("#", ""))) as HTMLElement | null
    if (target) {
      const navOffset = 72
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "instant" })
      window.history.pushState(null, "", href)
    }
  }

  const handleDesktopNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === "#" || href === "#home" || href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      if (window.location.hash) {
        window.history.pushState(null, "", window.location.pathname)
      }
      return
    }
    const target = (document.querySelector(href) || document.getElementById(href.replace("#", ""))) as HTMLElement | null
    if (target) {
      const navOffset = 72
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" })
      window.history.pushState(null, "", href)
    }
  }

  return (
    <>
      {/* Tap backdrop to close mobile dropdown */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-40 md:hidden pointer-events-auto"
          aria-hidden="true"
        />
      )}

      {/* Floating navigation bar */}
      <div className="fixed top-3.5 sm:top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-3xl">

          {/* Main transparent glass pill */}
          <nav
            className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-[#F5F4F0]/30 dark:bg-[#0C0D10]/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]"
          >
            {/* Left brand title: perfectly aligned vertically and horizontally */}
            <div className="flex items-center md:min-w-[150px]">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  close()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  if (window.location.hash) {
                    window.history.pushState(null, "", window.location.pathname)
                  }
                }}
                className="font-pixel text-xs tracking-[0.25em] text-black/75 dark:text-white/85 select-none inline-flex items-center leading-none h-8 hover:opacity-80 transition-opacity cursor-pointer"
              >
                SPYTHER
              </a>
            </div>

            {/* Desktop links — centered between left and right */}
            <div className="hidden md:flex items-center justify-center gap-7 flex-1" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleDesktopNavClick(e, l.href)}
                  className="text-[11px] text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors duration-200 tracking-wide cursor-pointer"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center justify-end gap-2 md:min-w-[150px]">
              <ThemeToggle />

              {/* Desktop Get In Touch */}
              <a
                href="mailto:spytherispro@gmail.com"
                aria-label="Get In Touch via Email: spytherispro@gmail.com"
                title="Email: spytherispro@gmail.com"
                className="text-[11px] px-4 py-2 rounded-xl border border-black/10 text-black/60 hover:text-black hover:border-black/20 hover:bg-black/[0.03] dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.04] transition-all duration-200 tracking-wide hidden md:block"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                GET IN TOUCH
              </a>

              {/* Burger button — mobile only */}
              <button
                onClick={() => setOpen(v => !v)}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span
                  className="block h-px bg-black/60 dark:bg-white/70 transition-all duration-300 origin-center"
                  style={{
                    width: "18px",
                    transform: open ? "translateY(6px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="block h-px bg-black/60 dark:bg-white/70 transition-all duration-300"
                  style={{
                    width: "18px",
                    opacity: open ? 0 : 1,
                    transform: open ? "scaleX(0)" : "none",
                  }}
                />
                <span
                  className="block h-px bg-black/60 dark:bg-white/70 transition-all duration-300 origin-center"
                  style={{
                    width: "18px",
                    transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
                  }}
                />
              </button>
            </div>
          </nav>

          {/* Mobile dropdown drawer — transparent glass like reference site */}
          <div
            className={`md:hidden mt-2 rounded-2xl overflow-hidden transition-all duration-200 ease-out ${
              open
                ? "border border-black/[0.06] dark:border-white/[0.08] bg-[#F5F4F0]/35 dark:bg-[#0C0D10]/45 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2)]"
                : "border-transparent bg-transparent"
            }`}
            style={{
              maxHeight: open ? "380px" : "0px",
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
              maskImage: "radial-gradient(white, black)",
            }}
          >
            <div className="p-2 flex flex-col">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  data-mobile-link="true"
                  onClick={(e) => handleMobileNavClick(e, l.href)}
                  className="px-4 py-2.5 text-sm text-black/70 hover:text-black hover:bg-black/[0.03] dark:text-white/70 dark:hover:text-white dark:hover:bg-white/[0.04] rounded-xl transition-colors tracking-wide"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  {l.label}
                </a>
              ))}

              <div className="mt-1 pt-1 border-t border-black/[0.06] dark:border-white/[0.08]">
                <a
                  href="mailto:spytherispro@gmail.com"
                  onClick={close}
                  aria-label="Get In Touch via Email: spytherispro@gmail.com"
                  title="Email: spytherispro@gmail.com"
                  className="block text-center w-full text-xs py-2.5 rounded-xl border border-black/10 text-black/70 hover:text-black hover:border-black/20 hover:bg-black/[0.03] dark:border-white/10 dark:text-white/80 dark:hover:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.04] transition-all duration-200 tracking-wider font-medium"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  GET IN TOUCH
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
