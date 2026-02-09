"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Calendar, UserCheck, Zap, UserPlus, Activity, BarChart3 } from "lucide-react"
import { supabaseService } from "@/lib/supabaseService"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts"

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
  const [attendanceByDay, setAttendanceByDay] = useState<Array<{ date: string; count: number }>>([])
  const [visitorsByWeek, setVisitorsByWeek] = useState<Array<{ week: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(true)

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

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [attendance, visitors] = await Promise.all([
          supabaseService.getAttendanceByDay(14),
          supabaseService.getVisitorsByWeek(6),
        ])
        setAttendanceByDay(attendance)
        setVisitorsByWeek(visitors)
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setChartsLoading(false)
      }
    }
    loadChartData()
  }, [])

  const formatNumber = (num: number) => num.toLocaleString()
  const formatShortDate = (s: string) => {
    const d = new Date(s)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  const formatShortWeek = (s: string) => {
    const d = new Date(s)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Attendance (Last 14 Days)
              </CardTitle>
              <CardDescription>Daily check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              {chartsLoading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : attendanceByDay.length > 0 ? (
                <ChartContainer
                  config={{
                    count: { label: "Check-ins", color: "#3b82f6" },
                  }}
                  className="h-[280px] w-full"
                >
                  <BarChart data={attendanceByDay.map((d) => ({ ...d, label: formatShortDate(d.date) }))} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">No attendance data yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                New Visitors (Last 6 Weeks)
              </CardTitle>
              <CardDescription>Weekly visitor registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {chartsLoading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : visitorsByWeek.length > 0 ? (
                <ChartContainer
                  config={{
                    count: { label: "Visitors", color: "#8b5cf6" },
                  }}
                  className="h-[280px] w-full"
                >
                  <AreaChart data={visitorsByWeek.map((d) => ({ ...d, label: formatShortWeek(d.week) }))} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="url(#visitorsGradient)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">No visitor data yet</div>
              )}
            </CardContent>
          </Card>
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
