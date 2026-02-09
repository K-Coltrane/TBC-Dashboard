const SETTINGS_KEY = "church-admin-settings"

export interface AppSettings {
  churchName: string
  churchEmail: string
  churchPhone: string
  defaultLocation: string
  emailNotifications: boolean
  visitorAlerts: boolean
  serviceReminders: boolean
}

const defaults: AppSettings = {
  churchName: "Church Admin",
  churchEmail: "",
  churchPhone: "",
  defaultLocation: "",
  emailNotifications: true,
  visitorAlerts: true,
  serviceReminders: false,
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaults
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...defaults, ...JSON.parse(stored) }
    }
  } catch {
    // ignore
  }
  return { ...defaults }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings()
  const updated = { ...current, ...settings }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }
  return updated
}
