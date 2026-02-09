import { supabase } from './supabaseClient'

// Types
export interface ServiceType {
  id: number
  name: string
}

export interface Visitor {
  id: number
  first_name: string
  last_name: string
  phone?: string
  email?: string
  inviter_name?: string
  created_at?: string
}

export interface Service {
  id: number
  user_id: number
  service_type_id: number
  location?: string
  notes?: string
  started_at: string
  ended_at?: string
  created_at?: string
}

export interface Attendance {
  id: number
  service_id: number
  visitor_id: number
  checked_in_at: string
  created_at?: string
}

export interface Member {
  id: number
  first_name: string
  last_name: string
  dob?: string
  email?: string
  phone?: string
  location?: string
  department?: string
  status?: string
}

// Supabase Service Class
export class SupabaseService {
  // ==================== TEST CONNECTION ====================
  async testMembersTable(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      // Try to query the table first to see if it exists
      const { data, error } = await supabase
        .from('members')
        .select('id')
        .limit(1)

      if (error) {
        const errorObj = error as any
        return {
          success: false,
          error: errorObj.message || String(error),
          details: {
            code: errorObj.code,
            hint: errorObj.hint,
            details: errorObj.details,
          },
        }
      }

      // Also test insert permissions (this is likely the issue)
      // Table uses 'name' column, not 'first_name'/'last_name'
      const testInsert: any = {
        name: 'Test User',
        status: 'Active',
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('members')
        .insert(testInsert)
        .select()
        .single()

      if (insertError) {
        const insertErr = insertError as any
        // Clean up if insert succeeded but we got an error
        if (insertData?.id) {
          await supabase.from('members').delete().eq('id', insertData.id)
        }
        return {
          success: false,
          error: `Insert test failed: ${insertErr.message || String(insertError)}`,
          details: {
            code: insertErr.code,
            hint: insertErr.hint,
            details: insertErr.details,
            type: 'RLS_PERMISSION_ERROR',
          },
        }
      }

      // Clean up test data
      if (insertData?.id) {
        await supabase.from('members').delete().eq('id', insertData.id)
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || String(error),
        details: error,
      }
    }
  }

  // ==================== VISITORS ====================
  async getVisitors(limit?: number): Promise<Visitor[]> {
    let query = supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getVisitorsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }

  async getVisitorsThisMonth(): Promise<number> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd)

    if (error) throw error
    return count || 0
  }

  async addVisitor(visitor: {
    first_name: string
    last_name: string
    phone?: string
    email?: string
    inviter_name?: string
  }): Promise<Visitor> {
    const { data, error } = await supabase
      .from('visitors')
      .insert(visitor)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateVisitor(id: number, updates: Partial<Visitor>): Promise<Visitor> {
    const { data, error } = await supabase
      .from('visitors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteVisitor(id: number): Promise<void> {
    const { error } = await supabase.from('visitors').delete().eq('id', id)
    if (error) throw error
  }

  // ==================== SERVICES ====================
  async getServices(limit?: number): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select('*, service_types(name)')
      .order('started_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getServicesThisMonth(): Promise<number> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .gte('started_at', monthStart)
      .lte('started_at', monthEnd)

    if (error) throw error
    return count || 0
  }

  async addService(service: {
    user_id?: number
    service_type_id: number
    location?: string
    notes?: string
    started_at: string
    ended_at?: string
  }): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({ user_id: 1, ...service })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateService(id: number, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteService(id: number): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw error
  }

  // ==================== SERVICE TYPES ====================
  async getServiceTypes(): Promise<ServiceType[]> {
    const { data, error } = await supabase.from('service_types').select('*').order('name')

    if (error) throw error
    return data || []
  }

  async addServiceType(serviceType: { name: string; description?: string; frequency?: string }): Promise<ServiceType> {
    const { data, error } = await supabase
      .from('service_types')
      .insert({ name: serviceType.name })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateServiceType(id: number, updates: Partial<ServiceType>): Promise<ServiceType> {
    const { data, error } = await supabase
      .from('service_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteServiceType(id: number): Promise<void> {
    const { error } = await supabase.from('service_types').delete().eq('id', id)
    if (error) throw error
  }

  // ==================== ATTENDANCE ====================
  async getAttendance(limit?: number): Promise<any[]> {
    let query = supabase
      .from('attendance')
      .select(
        `
        *,
        visitors(first_name, last_name),
        services(service_types(name))
      `
      )
      .order('checked_in_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getUniqueAttendeesThisMonth(): Promise<number> {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    
    const { data, error } = await supabase
      .from('attendance')
      .select('visitor_id')
      .gte('checked_in_at', monthStart)
      .lte('checked_in_at', monthEnd)

    if (error) throw error
    
    // Get unique visitor_ids
    const uniqueAttendees = new Set(data?.map((a: any) => a.visitor_id) || [])
    return uniqueAttendees.size
  }

  async addAttendance(attendance: {
    service_id: number
    visitor_id: number
    checked_in_at: string
  }): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendance)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateAttendance(id: number, updates: Partial<Attendance>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteAttendance(id: number): Promise<void> {
    const { error } = await supabase.from('attendance').delete().eq('id', id)
    if (error) throw error
  }

  // ==================== MEMBERS ====================
  async getMembers(limit?: number): Promise<Member[]> {
    let query = supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query

    if (error) {
      console.error("Error fetching members:", error)
      throw error
    }
    
    // Transform data if table uses 'name' instead of 'first_name'/'last_name'
    if (data && data.length > 0 && data[0].name && !data[0].first_name) {
      return data.map((member: any) => {
        const nameParts = (member.name || '').split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        return {
          ...member,
          first_name: firstName,
          last_name: lastName,
        }
      })
    }
    
    return data || []
  }

  async getMembersCount(): Promise<number> {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }
  
  async getMemberById(id: number): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    
    // Transform if table uses 'name' instead of 'first_name'/'last_name'
    if (data && data.name && !data.first_name) {
      const nameParts = (data.name || '').split(' ')
      return {
        ...data,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
      }
    }
    
    return data
  }

  async addMember(member: {
    first_name: string
    last_name: string
    dob?: string
    email?: string
    phone?: string
    location?: string
    department?: string
    status?: string
  }): Promise<Member> {
    console.log("Attempting to add member:", member)
    
    // Combine first_name and last_name into name (for table schema compatibility)
    const fullName = `${member.first_name} ${member.last_name}`.trim()
    
    const insertData: any = {
      name: fullName, // Table has 'name' column, not 'first_name'/'last_name'
      dob: member.dob || null,
      email: member.email || null,
      phone: member.phone || null,
      location: member.location || null,
      department: member.department || null,
      status: member.status || 'Active',
    }
    
    console.log("Insert data:", insertData)
    
    const { data, error } = await supabase
      .from('members')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      // Log error in a way that preserves information
      console.error("=== SUPABASE INSERT ERROR ===")
      console.error("Error object:", error)
      
      // Try to extract error information
      let errorMessage = "Failed to add member"
      let errorCode = ""
      let errorHint = ""
      let errorDetails = ""
      
      // Supabase errors are PostgrestError objects
      try {
        // Access properties directly
        errorCode = (error as any).code || ""
        errorMessage = (error as any).message || errorMessage
        errorHint = (error as any).hint || ""
        errorDetails = (error as any).details || ""
        
        // Also try to stringify
        const errorStr = JSON.stringify(error, null, 2)
        console.error("Error JSON:", errorStr)
        
        console.error("Extracted - Code:", errorCode)
        console.error("Extracted - Message:", errorMessage)
        console.error("Extracted - Hint:", errorHint)
        console.error("Extracted - Details:", errorDetails)
      } catch (e) {
        console.error("Could not extract error properties:", e)
        errorMessage = String(error) || errorMessage
      }
      
      console.error("============================")
      
      // Create error with available info
      const err = new Error(errorMessage) as any
      err.code = errorCode
      err.hint = errorHint
      err.details = errorDetails
      throw err
    }
    
    if (!data) {
      throw new Error("No data returned from Supabase after insert")
    }
    
    console.log("Member successfully added:", data)
    
    // Transform response back to our interface format if table uses 'name'
    if (data && data.name && !data.first_name) {
      const nameParts = (data.name || '').split(' ')
      return {
        ...data,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
      }
    }
    
    return data
  }

  async updateMember(id: number, updates: Partial<Member>): Promise<Member> {
    // Transform updates if table uses 'name' instead of 'first_name'/'last_name'
    const updateData: any = { ...updates }
    
    // If updating first_name or last_name, combine into name
    if (updates.first_name !== undefined || updates.last_name !== undefined) {
      // Get current member to combine names properly
      const current = await this.getMemberById(id)
      const firstName = updates.first_name !== undefined ? updates.first_name : current.first_name
      const lastName = updates.last_name !== undefined ? updates.last_name : current.last_name
      updateData.name = `${firstName} ${lastName}`.trim()
      delete updateData.first_name
      delete updateData.last_name
    }
    
    const { data, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    // Transform response back to our interface format
    if (data && data.name && !data.first_name) {
      const nameParts = (data.name || '').split(' ')
      return {
        ...data,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
      }
    }
    
    return data
  }

  async deleteMember(id: number): Promise<void> {
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) throw error
  }

  // ==================== RECENT ACTIVITY ====================
  async getRecentActivity(limit = 15): Promise<
    Array<{
      id: string
      type: 'member' | 'visitor' | 'attendance'
      userName: string
      action: string
      timestamp: string
      sortKey: number
    }>
  > {
    try {
      const [members, visitors, attendance] = await Promise.all([
        supabase.from('members').select('id, name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('visitors').select('id, first_name, last_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('attendance')
          .select('id, checked_in_at, visitors(first_name, last_name), services(service_types(name))')
          .order('checked_in_at', { ascending: false })
          .limit(5),
      ])

      const activities: Array<{
        id: string
        type: 'member' | 'visitor' | 'attendance'
        userName: string
        action: string
        timestamp: string
        sortKey: number
      }> = []

      const formatName = (first: string, last?: string) => {
        if (first && last) return `${first} ${last}`.trim()
        if (first) return first
        return 'Unknown'
      }

      const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
        return date.toLocaleDateString()
      }

      ;(members.data || []).forEach((m: any) => {
        const name = m.name || 'Unknown'
        const parts = name.split(' ')
        const firstName = parts[0] || ''
        const lastName = parts.slice(1).join(' ') || ''
        activities.push({
          id: `member-${m.id}`,
          type: 'member',
          userName: formatName(firstName, lastName) || name,
          action: 'joined as member',
          timestamp: formatTimeAgo(m.created_at || new Date().toISOString()),
          sortKey: new Date(m.created_at || 0).getTime(),
        })
      })

      ;(visitors.data || []).forEach((v: any) => {
        activities.push({
          id: `visitor-${v.id}`,
          type: 'visitor',
          userName: formatName(v.first_name, v.last_name),
          action: 'registered as visitor',
          timestamp: formatTimeAgo(v.created_at || new Date().toISOString()),
          sortKey: new Date(v.created_at || 0).getTime(),
        })
      })

      ;(attendance.data || []).forEach((a: any) => {
        const visitor = a.visitors
        const service = a.services
        const serviceName = service?.service_types?.name || 'service'
        const userName = visitor ? formatName(visitor.first_name, visitor.last_name) : 'Someone'
        activities.push({
          id: `attendance-${a.id}`,
          type: 'attendance',
          userName,
          action: `attended ${serviceName}`,
          timestamp: formatTimeAgo(a.checked_in_at || new Date().toISOString()),
          sortKey: new Date(a.checked_in_at || 0).getTime(),
        })
      })

      return activities
        .sort((a, b) => b.sortKey - a.sortKey)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }
}

export const supabaseService = new SupabaseService()

