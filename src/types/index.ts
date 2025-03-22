export interface DateTimeInfo {
  date: string
  time: string
}

export interface MonitorData {
  change: number
  color: string
  image: string
  last_update: string
  percent: number
  price: number
  price_old: number
  symbol: string
  title: string
}

export interface Monitors {
  bcv: MonitorData
  enparalelovzla: MonitorData
  [key: string]: MonitorData
}

export interface DolarApiResponse {
  datetime: DateTimeInfo
  monitors: Monitors
}

export interface CurrencyCardProps {
  title: string
  price: number
  symbol: string
  change: number
  percent: number
  color: string
  lastUpdate?: string
  onClick: () => void
  gradient: string
  className?: string
}

