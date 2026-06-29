import { Check, Monitor, Moon, Palette, Sun } from "lucide-react"
import { type ThemeMode, useTheme } from "shadcn-theme-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MODES: ThemeMode[] = ["light", "dark", "system"]

const modeIcons: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const modeLabels: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

function formatThemeName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-")
}

export function ThemeToggle() {
  const { mode, setMode, palette, setPalette, themes } = useTheme()
  const ModeIcon = modeIcons[mode]

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Mode: ${modeLabels[mode]}`}
            title={`Mode: ${modeLabels[mode]}`}
          >
            <ModeIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MODES.map((m) => {
            const Icon = modeIcons[m]
            return (
              <DropdownMenuItem
                key={m}
                onSelect={() => setMode(m)}
                aria-checked={mode === m}
                role="menuitemradio"
              >
                <Icon />
                <span>{modeLabels[m]}</span>
                {mode === m && <Check className="ml-auto" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label={`Theme: ${formatThemeName(palette)}`}
            className="gap-1.5"
          >
            <Palette />
            <span>{formatThemeName(palette)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((t) => (
            <DropdownMenuItem
              key={t}
              onSelect={() => setPalette(t)}
              aria-checked={palette === t}
              role="menuitemradio"
            >
              <span>{formatThemeName(t)}</span>
              {palette === t && <Check className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
