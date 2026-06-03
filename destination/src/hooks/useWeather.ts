import { useState, useEffect } from 'react'
import axios from 'axios'

interface WeatherData {
  temperature: number
  apparentTemp: number
  weatherCode: number
  city: string
}

const WMO_ICONS: Record<number, string> = {
  0: '\u2600\uFE0F',
  1: '\uD83C\uDF24\uFE0F',
  2: '\u26C5',
  3: '\u2601\uFE0F',
  45: '\uD83C\uDF2B\uFE0F',
  48: '\uD83C\uDF2B\uFE0F',
  51: '\uD83C\uDF26\uFE0F',
  53: '\uD83C\uDF26\uFE0F',
  55: '\uD83C\uDF26\uFE0F',
  61: '\uD83C\uDF27\uFE0F',
  63: '\uD83C\uDF27\uFE0F',
  65: '\uD83C\uDF27\uFE0F',
  71: '\uD83C\uDF28\uFE0F',
  73: '\uD83C\uDF28\uFE0F',
  75: '\uD83C\uDF28\uFE0F',
  80: '\uD83C\uDF27\uFE0F',
  81: '\uD83C\uDF27\uFE0F',
  82: '\uD83C\uDF27\uFE0F',
  95: '\u26C8\uFE0F',
  96: '\u26C8\uFE0F',
  99: '\u26C8\uFE0F',
}

async function fetchWeather(lat: number, lng: number, city: string) {
  const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,apparent_temperature,weather_code',
      timezone: 'auto',
    },
  })
  return {
    temperature: res.data.current.temperature_2m as number,
    apparentTemp: res.data.current.apparent_temperature as number,
    weatherCode: res.data.current.weather_code as number,
    city,
  }
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const geo = await axios.get('https://ipapi.co/json/')

        if (cancelled) return

        const { latitude, longitude, city, country_name: country } = geo.data
        const cityLabel = city ? `${city}${country ? `, ${country}` : ''}` : ''

        const weather = await fetchWeather(latitude, longitude, cityLabel)
        if (!cancelled) setData(weather)
      } catch {
        if (!cancelled) {
          try {
            const weather = await fetchWeather(39.9042, 116.4074, 'Beijing, China')
            if (!cancelled) setData(weather)
          } catch {
            if (!cancelled) setError('获取天气失败')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { ...data, loading, error, icon: data ? (WMO_ICONS[data.weatherCode] ?? '\u2601\uFE0F') : '' }
}
