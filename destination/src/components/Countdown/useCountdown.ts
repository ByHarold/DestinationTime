import { useState, useEffect, useMemo } from 'react'

interface CountdownResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
  totalSeconds: number
  now: Date
}

function computeDiff(target: Date, now: Date): CountdownResult {
  const diffMs = target.getTime() - now.getTime()
  const isPast = diffMs <= 0
  const absMs = Math.abs(diffMs)
  const totalSeconds = Math.floor(absMs / 1000)

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, isPast, totalSeconds, now }
}

export function useCountdown(targetDate: Date): CountdownResult {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => computeDiff(targetDate, now), [targetDate, now])
}
