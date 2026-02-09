"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Mail, HelpCircle, Save } from "lucide-react"
import { getSettings, saveSettings, type AppSettings } from "@/lib/settings"

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(getSettings())
  }, [])

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : ""
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const handleSave = () => {
    if (!settings) return
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : null))
  }

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-slate-500">Loading settings...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 mt-1">Manage your church admin preferences</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saved}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </div>

        {/* General Settings */}
        <Card id="general" className="border-0 shadow-sm scroll-mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-slate-600" />
              General Settings
            </CardTitle>
            <CardDescription>Basic church information and defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="churchName">Church name</Label>
                <Input
                  id="churchName"
                  value={settings.churchName}
                  onChange={(e) => updateSetting("churchName", e.target.value)}
                  placeholder="e.g. Grace Community Church"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="churchEmail">Contact email</Label>
                <Input
                  id="churchEmail"
                  type="email"
                  value={settings.churchEmail}
                  onChange={(e) => updateSetting("churchEmail", e.target.value)}
                  placeholder="office@church.org"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="churchPhone">Phone number</Label>
                <Input
                  id="churchPhone"
                  value={settings.churchPhone}
                  onChange={(e) => updateSetting("churchPhone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLocation">Default service location</Label>
                <Input
                  id="defaultLocation"
                  value={settings.defaultLocation}
                  onChange={(e) => updateSetting("defaultLocation", e.target.value)}
                  placeholder="Main auditorium"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card id="email" className="border-0 shadow-sm scroll-mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="w-5 h-5 text-slate-600" />
              Email Preferences
            </CardTitle>
            <CardDescription>Configure notification and reminder emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email notifications</Label>
                <p className="text-sm text-slate-500">Receive email when new visitors or members are added</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visitorAlerts">Visitor alerts</Label>
                <p className="text-sm text-slate-500">Get notified when a visitor checks in</p>
              </div>
              <Switch
                id="visitorAlerts"
                checked={settings.visitorAlerts}
                onCheckedChange={(checked) => updateSetting("visitorAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="serviceReminders">Service reminders</Label>
                <p className="text-sm text-slate-500">Reminder emails before scheduled services</p>
              </div>
              <Switch
                id="serviceReminders"
                checked={settings.serviceReminders}
                onCheckedChange={(checked) => updateSetting("serviceReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card id="help" className="border-0 shadow-sm scroll-mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="w-5 h-5 text-slate-600" />
              Help & Support
            </CardTitle>
            <CardDescription>Resources and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              For support with the Church Admin Dashboard, please contact your system administrator
              or refer to your deployment documentation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:support@example.com">Contact support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
