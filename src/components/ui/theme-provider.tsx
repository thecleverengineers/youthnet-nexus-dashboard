
import React, { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { premiumLightTheme, premiumDarkTheme } from '@/theme/premiumTheme'
import { muiTheme } from '@/theme/muiTheme'

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  muiTheme: any
  isPremiumTheme: boolean
  setIsPremiumTheme: (isPremium: boolean) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  muiTheme: muiTheme,
  isPremiumTheme: false,
  setIsPremiumTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "youthnet-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [isPremiumTheme, setIsPremiumTheme] = useState<boolean>(
    () => localStorage.getItem("youthnet-premium-theme") === "true"
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const getCurrentMuiTheme = () => {
    if (isPremiumTheme) {
      return theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? premiumDarkTheme
        : premiumLightTheme
    }
    return muiTheme
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    muiTheme: getCurrentMuiTheme(),
    isPremiumTheme,
    setIsPremiumTheme: (isPremium: boolean) => {
      localStorage.setItem("youthnet-premium-theme", isPremium.toString())
      setIsPremiumTheme(isPremium)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <MuiThemeProvider theme={value.muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
