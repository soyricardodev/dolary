import { DollarSign, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCurrencyData } from "@/hooks/use-currency-data"

export function AppHeader() {
  const { refetch, isRefetching } = useCurrencyData()

  return (
    <header className="mb-3 text-center relative">
      <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full mb-2">
        <DollarSign className="h-5 w-5 mr-1" />
        <h1 className="text-xl font-bold">Dolary</h1>
      </div>
      <p className="text-gray-600 text-xs mb-2">Tasas de cambio actualizadas para Venezuela</p>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching} className="text-xs h-8">
          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefetching ? "animate-spin" : ""}`} />
          Actualizar datos
        </Button>
      </div>
    </header>
  )
}

