"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Users, UserCheck, Zap, Calendar, Settings, LogOut, LayoutDashboard, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    // Clear authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userName")
    }
    // Redirect to login
    router.push("/")
    setLogoutOpen(false)
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Members",
      href: "/dashboard/members",
      icon: Users,
    },
    {
      label: "Services",
      href: "/dashboard/services",
      icon: Calendar,
    },
    {
      label: "Visitors",
      href: "/dashboard/visitors",
      icon: UserCheck,
    },
    {
      label: "Attendance",
      href: "/dashboard/attendance",
      icon: Zap,
    },
    {
      label: "Service Types",
      href: "/dashboard/service-types",
      icon: Settings,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: SlidersHorizontal,
    },
  ]

  return (
    <aside className={cn(
      "relative bg-slate-900/98 backdrop-blur-sm border-r border-slate-700/50 h-screen flex flex-col transition-all duration-300 ease-out rounded-r-2xl shrink-0",
      isCollapsed ? "w-[72px]" : "w-64"
    )}>
      {/* Logo Section - Click to collapse/expand */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "w-full border-b border-slate-700/50 bg-slate-800/50 transition-all duration-300 text-left cursor-pointer hover:bg-slate-800/80 active:scale-[0.99]",
          isCollapsed ? "p-4" : "p-5"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className={cn(
          "flex items-center gap-4 transition-all duration-300",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 ring-1 ring-slate-600 flex-shrink-0">
            <Image
              src="/Logo.jpg"
              alt="Church Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="text-base font-semibold text-white leading-tight">Church Admin</h1>
              <p className="text-xs text-slate-400 font-medium">Management Portal</p>
            </div>
          )}
        </div>
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto relative">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg transition-all duration-200 relative",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
                isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
              )}
              <div
                className={cn(
                  "flex items-center justify-center rounded-md transition-all flex-shrink-0",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-800/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-white",
                  isCollapsed ? "w-9 h-9" : "w-8 h-8"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <span className={cn("font-medium text-sm whitespace-nowrap", isActive && "font-semibold")}>{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700/50 p-3">
        <button
          onClick={() => setLogoutOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group",
            isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className={cn(
            "flex items-center justify-center rounded-md bg-slate-800/50 text-slate-500 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all flex-shrink-0",
            isCollapsed ? "w-9 h-9" : "w-8 h-8"
          )}>
            <LogOut className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-100">
              Cancel
            </Button>
            <Button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 text-white">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
