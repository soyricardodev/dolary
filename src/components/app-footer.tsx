import { Github } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-1">
        <p className="flex gap-1">Creado por{" "}<a
          href="https://github.com/ricardocr987"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub de Ricardo Castro"
          className="flex items-center gap-1 hover:underline"
        >Ricardo Castro

          <Github className="h-3.5 w-3.5" />
        </a></p>
      </div>
    </footer>
  )
}

