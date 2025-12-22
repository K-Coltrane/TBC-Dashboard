"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, UserCheck, Zap, Calendar, Settings, LogOut, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react"
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
  ]

  return (
    <aside className={cn(
      "relative bg-gradient-to-b from-sidebar to-sidebar/95 border-r border-sidebar-border/50 h-screen flex flex-col shadow-xl transition-all duration-300",
      isCollapsed ? "w-20" : "w-72"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar-accent/20 to-transparent transition-all duration-300",
        isCollapsed ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "flex items-center gap-4 transition-all duration-300",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-background shadow-lg ring-2 ring-primary/20 flex-shrink-0">
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
              <h1 className="text-lg font-bold text-sidebar-foreground leading-tight">Church Admin</h1>
              <p className="text-xs text-sidebar-foreground/60 font-medium">Management Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 z-10 w-6 h-6 rounded-full bg-sidebar border-2 border-sidebar-border shadow-md flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative">
        {!isCollapsed && (
          <div className="px-2 py-2 mb-2">
            <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Navigation</p>
          </div>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
              )}
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg transition-all flex-shrink-0",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-sidebar-accent/30 text-sidebar-foreground/70 group-hover:bg-sidebar-accent/50 group-hover:text-sidebar-foreground",
                  isCollapsed ? "w-10 h-10" : "w-8 h-8"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <>
                  <span className={cn("font-medium text-sm whitespace-nowrap", isActive && "font-semibold")}>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className={cn(
        "border-t border-sidebar-border/50 bg-gradient-to-r from-sidebar-accent/10 to-transparent transition-all duration-300",
        isCollapsed ? "p-4" : "p-4"
      )}>
        <button
          onClick={() => setLogoutOpen(true)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group",
            isCollapsed ? "justify-center px-3 py-3" : "px-4 py-3"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className={cn(
            "flex items-center justify-center rounded-lg bg-destructive/10 text-destructive/70 group-hover:bg-destructive/20 group-hover:text-destructive transition-all flex-shrink-0",
            isCollapsed ? "w-10 h-10" : "w-8 h-8"
          )}>
            <LogOut className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <span className="font-medium text-sm group-hover:font-semibold">Logout</span>
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
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
