import { AnimatePresence, motion } from 'framer-motion'
import { addDays, addMonths, format, subMonths } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function sameDay(a: Date | undefined, b: Date) {
  return Boolean(a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())
}

function to12hParts(value: Date) {
  const h24 = value.getHours()
  const ampm: 'AM' | 'PM' = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { hh12: String(h12), mm: pad2(value.getMinutes()), ampm }
}

function to24Hour(hh12: number, ampm: 'AM' | 'PM') {
  if (ampm === 'AM') return hh12 === 12 ? 0 : hh12
  return hh12 === 12 ? 12 : hh12 + 12
}

function monthDays(viewMonth: Date) {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function tzLabelForNow() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time'
    const mins = -new Date().getTimezoneOffset()
    const sign = mins >= 0 ? '+' : '-'
    const abs = Math.abs(mins)
    const hh = Math.floor(abs / 60)
    const mm = abs % 60
    return `${tz} (GMT${sign}${pad2(hh)}:${pad2(mm)})`
  } catch {
    return 'Local time'
  }
}

export function DateTimePicker(props: {
  value: Date | null
  onChange: (value: Date) => void
  min?: Date
  label?: string
}) {
  const { value, onChange, min } = props
  const [open, setOpen] = useState(false)
  const selectedDay = value ? startOfLocalDay(value) : undefined
  const [viewMonth, setViewMonth] = useState(() => selectedDay || startOfLocalDay(new Date()))

  const parts = useMemo(
    () => (value ? to12hParts(value) : { hh12: '9', mm: '00', ampm: 'AM' as const }),
    [value],
  )
  const [hh12, setHh12] = useState(parts.hh12)
  const [mm, setMm] = useState(parts.mm)
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(parts.ampm)

  useEffect(() => {
    setHh12(parts.hh12)
    setMm(parts.mm)
    setAmpm(parts.ampm)
    if (value) setViewMonth(startOfLocalDay(value))
  }, [parts.hh12, parts.mm, parts.ampm, value])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const display = value ? format(value, 'EEE, MMM d • p') : 'Pick date and time'
  const days = useMemo(() => monthDays(viewMonth), [viewMonth])
  const minDay = min ? startOfLocalDay(min) : null
  const selectedOrToday = selectedDay || startOfLocalDay(new Date())
  const timeZoneLabel = useMemo(() => tzLabelForNow(), [])

  const apply = (day: Date, hh12Str: string, mmStr: string, nextAmPm: 'AM' | 'PM') => {
    const next = startOfLocalDay(day)
    const h12n = Math.max(1, Math.min(12, Number(hh12Str || 12)))
    const mn = Math.max(0, Math.min(59, Number(mmStr || 0)))
    next.setHours(to24Hour(h12n, nextAmPm), mn, 0, 0)
    onChange(next)
  }

  const quickPicks = [
    { label: 'Tomorrow 9:00 AM', date: () => { const d = addDays(new Date(), 1); d.setHours(9, 0, 0, 0); return d } },
    { label: 'Tomorrow 6:00 PM', date: () => { const d = addDays(new Date(), 1); d.setHours(18, 0, 0, 0); return d } },
  ]

  return (
    <>
      <button
        className="kb-ring w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-left transition hover:bg-white/8"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">{props.label || 'Delivery date & time'}</div>
            <div className="mt-1 text-sm font-semibold text-white">{display}</div>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <CalendarDays size={18} />
            <Clock size={18} />
          </div>
        </div>
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-black/85" onClick={() => setOpen(false)} />
                  <motion.div
                    className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-white/15 bg-[#050816] kb-shadow"
                    initial={{ y: 20, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                  >
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#050816] px-4 py-3">
                      <div className="text-sm font-semibold text-white">Delivery date and time</div>
                      <button className="kb-ring rounded-lg p-2 text-white/70 hover:bg-white/8" onClick={() => setOpen(false)} aria-label="Close">
                        <X size={18} />
                      </button>
                    </div>

              <div className="grid gap-3 p-3 min-[520px]:grid-cols-[minmax(0,1fr)_260px] sm:p-4">
                <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="kb-ring rounded-lg border border-white/10 bg-black/20 p-2 text-white/80 hover:bg-white/8"
                        onClick={() => setViewMonth((m) => subMonths(m, 1))}
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="kb-ring rounded-lg border border-white/10 bg-black/20 p-2 text-white/80 hover:bg-white/8"
                        onClick={() => setViewMonth((m) => addMonths(m, 1))}
                        aria-label="Next month"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="text-base font-semibold text-white">{format(viewMonth, 'MMMM yyyy')}</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/55">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="py-0.5">{d}</div>
                    ))}
                    {days.map((day) => {
                      const outside = day.getMonth() !== viewMonth.getMonth()
                      const disabled = Boolean(minDay && startOfLocalDay(day).getTime() < minDay.getTime())
                      const selected = sameDay(selectedDay, day)
                      const today = sameDay(startOfLocalDay(new Date()), day)
                      return (
                        <button
                          key={day.toISOString()}
                          disabled={disabled}
                          className={`kb-ring flex h-8 w-full items-center justify-center rounded-lg border text-sm font-semibold transition sm:h-9 ${
                            selected
                              ? 'border-white/25 bg-gradient-to-br from-amber-200 to-pink-400 text-black'
                              : today
                                ? 'border-cyan-200/30 bg-black/25 text-white'
                                : 'border-transparent bg-black/[0.18] text-white hover:border-white/10 hover:bg-white/10'
                          } ${outside ? 'opacity-35' : ''} ${disabled ? 'cursor-not-allowed opacity-20' : ''}`}
                          onClick={() => {
                            if (disabled) return
                            apply(day, hh12, mm, ampm)
                          }}
                        >
                          {day.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                    <div className="text-xs text-white/60">Time</div>
                    <div className="mt-2 grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                      <Wheel
                        ariaLabel="Hour"
                        value={hh12}
                        items={Array.from({ length: 12 }, (_, i) => String(i + 1))}
                        onChange={(v) => {
                          setHh12(v)
                          apply(selectedOrToday, v, mm, ampm)
                        }}
                      />
                      <div className="text-xl font-bold text-white/55">:</div>
                      <Wheel
                        ariaLabel="Minute"
                        value={mm}
                        items={Array.from({ length: 12 }, (_, i) => pad2(i * 5))}
                        onChange={(v) => {
                          setMm(v)
                          apply(selectedOrToday, hh12, v, ampm)
                        }}
                      />
                      <div className="grid gap-2">
                        {(['AM', 'PM'] as const).map((period) => (
                          <button
                            key={period}
                            className={`kb-ring rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                              ampm === period
                                ? 'border-white/20 bg-white text-black'
                                : 'border-white/10 bg-black/25 text-white/80 hover:bg-white/8'
                            }`}
                            onClick={() => {
                              setAmpm(period)
                              apply(selectedOrToday, hh12, mm, period)
                            }}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/55">{timeZoneLabel}</div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#111827] p-3">
                    <div className="text-xs text-white/60">Quick picks</div>
                    <div className="mt-2 grid gap-2">
                      {quickPicks.map((q) => (
                        <Button
                          key={q.label}
                          variant="secondary"
                          className="w-full justify-center"
                          onClick={() => {
                            const next = q.date()
                            if (min && next.getTime() < min.getTime()) return
                            onChange(next)
                          }}
                        >
                          {q.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}

function Wheel(props: {
  items: string[]
  value: string
  onChange: (v: string) => void
  ariaLabel: string
}) {
  const { items, value, onChange, ariaLabel } = props
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    const active = itemRefs.current.get(value)
    if (!el || !active) return
    const target = active.offsetTop - (el.clientHeight / 2 - active.clientHeight / 2)
    el.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior })
  }, [value])

  return (
    <div className="kb-wheel" role="listbox" aria-label={ariaLabel}>
      <div
        ref={wrapRef}
        className="kb-wheel-scroll kb-scroll"
        onScroll={() => {
          const el = wrapRef.current
          if (!el) return
          if (raf.current) cancelAnimationFrame(raf.current)
          raf.current = requestAnimationFrame(() => {
            const center = el.scrollTop + el.clientHeight / 2
            let best: { v: string; d: number } | null = null
            for (const v of items) {
              const node = itemRefs.current.get(v)
              if (!node) continue
              const mid = node.offsetTop + node.clientHeight / 2
              const d = Math.abs(mid - center)
              if (!best || d < best.d) best = { v, d }
            }
            if (best && best.v !== value) onChange(best.v)
          })
        }}
      >
        <div className="kb-wheel-pad" />
        {items.map((v) => (
          <div
            key={v}
            ref={(node) => {
              if (node) itemRefs.current.set(v, node)
            }}
            className={`kb-wheel-item ${v === value ? 'kb-wheel-item-active' : ''}`}
            onClick={() => onChange(v)}
            role="option"
            aria-selected={v === value}
          >
            {v}
          </div>
        ))}
        <div className="kb-wheel-pad" />
      </div>
      <div className="kb-wheel-highlight" />
    </div>
  )
}
