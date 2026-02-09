"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Calendar, UserCheck, Zap, UserPlus, Activity } from "lucide-react"
import { supabaseService } from "@/lib/supabaseService"

interface ActivityItem {
  id: string
  type: string
  userName: string
  action: string
  timestamp: string
}

export default function DashboardPage() {
  const [totalMembers, setTotalMembers] = useState<number>(0)
  const [servicesThisMonth, setServicesThisMonth] = useState<number>(0)
  const [visitorsThisMonth, setVisitorsThisMonth] = useState<number>(0)
  const [attendanceRate, setAttendanceRate] = useState<number>(0)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [totalMembersCount, servicesThisMonthCount, visitorsThisMonthCount, uniqueAttendeesCount] =
          await Promise.all([
            supabaseService.getMembersCount(),
            supabaseService.getServicesThisMonth(),
            supabaseService.getVisitorsThisMonth(),
            supabaseService.getUniqueAttendeesThisMonth(),
          ])

        setTotalMembers(totalMembersCount)
        setServicesThisMonth(servicesThisMonthCount)
        setVisitorsThisMonth(visitorsThisMonthCount)

        const attendanceRateValue =
          totalMembersCount > 0
            ? Math.min(100, Math.round((uniqueAttendeesCount / totalMembersCount) * 100))
            : uniqueAttendeesCount > 0
              ? 100
              : 0
        setAttendanceRate(attendanceRateValue)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        const activity = await supabaseService.getRecentActivity(15)
        setRecentActivity(activity)
      } catch (error) {
        console.error("Error loading recent activity:", error)
      } finally {
        setActivityLoading(false)
      }
    }

    loadRecentActivity()
  }, [])

  const formatNumber = (num: number) => num.toLocaleString()

  const stats = [
    {
      title: "Total Members",
      value: loading ? "..." : formatNumber(totalMembers),
      description: "Active members",
      icon: Users,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600",
    },
    {
      title: "Services This Month",
      value: loading ? "..." : formatNumber(servicesThisMonth),
      description: "Services held",
      icon: Calendar,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600",
    },
    {
      title: "Visitors",
      value: loading ? "..." : formatNumber(visitorsThisMonth),
      description: "This month",
      icon: UserCheck,
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-600",
    },
    {
      title: "Attendance Rate",
      value: loading ? "..." : `${attendanceRate}%`,
      description: "Current average",
      icon: Zap,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-600",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member":
        return <UserPlus className="w-4 h-4 text-blue-500" />
      case "visitor":
        return <UserCheck className="w-4 h-4 text-violet-500" />
      case "attendance":
        return <Zap className="w-4 h-4 text-amber-500" />
      default:
        return <Activity className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-1">Here&apos;s an overview of your church activities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.title}
                className="border-0 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      {loading ? (
                        <>
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-4 w-24 mt-1" />
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                          <p className="text-xs text-slate-500">{stat.description}</p>
                        </>
                      )}
                    </div>
                    <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your church system</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16 shrink-0" />
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-0 divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{activity.userName}</p>
                      <p className="text-sm text-slate-500">{activity.action}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No recent activity</p>
                <p className="text-sm text-slate-400 mt-1">Activity will appear here as members, visitors, and attendance are recorded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
