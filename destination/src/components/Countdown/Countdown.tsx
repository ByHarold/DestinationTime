import { useEffect } from 'react'
import { Card } from 'tdesign-react'
import { useCountdown } from './useCountdown'
import { useWeather } from '../../hooks/useWeather'

const TARGET = new Date(
  import.meta.env.VITE_COUNTDOWN_DATE || '2026-12-18T00:00:00+08:00',
)
const NAME = import.meta.env.VITE_COUNTDOWN_NAME || '2026年12月18日'
const TAB_TITLE = import.meta.env.VITE_COUNTDOWN_TITLE || '倒计时'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function UnitBlock({ value, label, idx }: { value: number; label: string; idx: number }) {
  return (
    <div className={`countdown-unit unit-${idx}`}>
      <span className="countdown-value">{pad(value)}</span>
      <span className="countdown-label">{label}</span>
    </div>
  )
}

export function Countdown() {
  const { days, hours, minutes, seconds, isPast, now } = useCountdown(TARGET)

  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)
  const todaySecsLeft = Math.floor((endOfToday.getTime() - now.getTime()) / 1000)
  const todayHoursLeft = Math.floor(todaySecsLeft / 3600)
  const todayMinsLeft = Math.floor((todaySecsLeft % 3600) / 60)

  const weather = useWeather()

  const dateStr = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(now)

  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const hour = now.getHours()
  const period = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 14 ? 'noon' : hour < 18 ? 'afternoon' : 'night'

  useEffect(() => {
    document.title = TAB_TITLE
  }, [])

  return (
    <div className={`countdown-wrapper period-${period}`}>
      <Card
        title=""
        bordered={false}
        className="countdown-card"
      >
        {weather.loading ? (
          <p className="countdown-weather">获取天气中...</p>
        ) : weather.error ? null : (
          <p className="countdown-weather">
            <span className="weather-icon">{weather.icon}</span>
            <span className="weather-temp">{weather.temperature}°C</span>
            <span className="weather-feel">体感 {weather.apparentTemp}°C</span>
            {weather.city && <span className="weather-city">{weather.city}</span>}
          </p>
        )}

        <p className="countdown-clock">{dateStr} {timeStr}</p>

        <h1 className="countdown-title">
          {isPast
            ? `已超过 ${NAME}`
            : `距离 ${NAME}`}
        </h1>

        <div className="countdown-display">
          <UnitBlock value={days} label="天" idx={0} />
          <span className="countdown-sep">:</span>
          <UnitBlock value={hours} label="时" idx={1} />
          <span className="countdown-sep">:</span>
          <UnitBlock value={minutes} label="分" idx={2} />
          <span className="countdown-sep">:</span>
          <UnitBlock value={seconds} label="秒" idx={3} />
        </div>

        <p className="countdown-today">
          今日剩余 <strong>{todayHoursLeft}</strong> 小时 <strong>{todayMinsLeft}</strong> 分钟
        </p>

        {isPast && (
          <p className="countdown-hint">目标时间已过，正计时中</p>
        )}
      </Card>
    </div>
  )
}
