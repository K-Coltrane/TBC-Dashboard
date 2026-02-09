"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isAuthenticated } from "@/lib/auth"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  const backgroundImages = ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"]

  // Carousel: cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % backgroundImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!name || !password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      const validUsers = [
        { name: "Admin", password: "admin123" },
        { name: "Admin2", password: "admin123" },
      ]

      const user = validUsers.find(
        (u) => u.name.toLowerCase() === name.trim().toLowerCase() && u.password === password
      )

      if (!user) {
        setError("Invalid username or password")
        setLoading(false)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userName", user.name)

      window.location.href = "/dashboard"
    } catch {
      setError("Login failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Left Section - Visual / Promotional (40-45%) */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-col relative overflow-hidden rounded-r-3xl">
        {backgroundImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === bgIndex ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
            }`}
            priority={i === 0}
            sizes="45vw"
          />
        ))}
        <div className="absolute inset-0 bg-blue-950/40" />

        <div className="relative z-10 flex flex-col flex-1 p-8">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm shrink-0">
              <Image
                src="/Logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end pb-12">
            <p className="text-white text-2xl xl:text-3xl font-light tracking-tight">
              Capturing Moments,
            </p>
            <p className="text-white text-2xl xl:text-3xl font-light tracking-tight">
              Creating Memories
            </p>
            <div className="flex gap-2 mt-8">
              {backgroundImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBgIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i === bgIndex ? "bg-white" : "bg-white/30"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form (55-60%) */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-gradient-to-b from-white from-0% via-blue-50/50 via-50% to-blue-100/70 to-100% lg:-ml-8 lg:rounded-l-3xl lg:min-w-0">
        <div className="w-full max-w-[360px] mx-auto text-center text-slate-900">
          <h1 className="text-3xl font-semibold mb-8 tracking-tight">Login</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-xl border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label htmlFor="name" className="text-sm font-medium text-slate-600">
                Email or Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your email or name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-12 rounded-xl text-base bg-white/80 border-slate-200 hover:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400/40 transition-all duration-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-sm font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 rounded-xl text-base pr-12 bg-white/80 border-slate-200 hover:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400/40 transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/30"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                Or login with
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 bg-white/60 hover:bg-white/80 transition-all duration-200 text-slate-700"
              type="button"
              disabled
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 bg-white/60 hover:bg-white/80 transition-all duration-200 text-slate-700"
              type="button"
              disabled
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
