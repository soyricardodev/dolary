"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDown, ArrowUp, Copy, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { CurrencyCardProps } from "@/types"

export function CurrencyCard({
  title,
  price,
  symbol,
  change,
  percent,
  lastUpdate,
  onClick,
  gradient,
  className = "",
}: CurrencyCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(price.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card
      className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-0 h-[140px] ${className}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
      <div className="relative p-3 text-white h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            title="Copiar valor"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-baseline mb-1">
          <span className="text-xl font-bold">{formatCurrency(price)}</span>
          <span className="ml-1 opacity-80 text-xs">{symbol}</span>
        </div>

        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 w-max text-xs">
          {change >= 0 ? (
            <ArrowUp className="h-3 w-3 text-green-300 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 text-white mr-1" />
          )}

          <span className="font-medium">
            {change >= 0 ? "+" : ""}
            {formatCurrency(change)} ({percent.toFixed(2)}%)
          </span>
        </div>

        <div className="mt-auto text-xs opacity-80">Actualizado: {lastUpdate}</div>
      </div>
    </Card>
  )
}

