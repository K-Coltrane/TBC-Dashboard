"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: {
    name: string
    email: string
    phone: string
    location: string
    department: string
    status: string
  }) => void
}

export function AddMemberModal({ open, onOpenChange, onAddMember }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    department: "",
    status: "Active",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Please enter the member's name")
      return
    }
    onAddMember(formData)
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      department: "",
      status: "Active",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Enter member details to add them to the church</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Full name" value={formData.name} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
         
         

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="City or area"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auditorium">Auditorium</SelectItem>
                <SelectItem value="Baccenta ">Baccenta</SelectItem>
                <SelectItem value="Billboards&Posters">Billboards & Posters</SelectItem>
                <SelectItem value="Camera">Camera</SelectItem>
                <SelectItem value="Camp">Camp</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Dispenser">Dispenser</SelectItem>
                <SelectItem value="ECG">ECG</SelectItem>
                <SelectItem value="Editorial Board">Editorial Board</SelectItem>
                <SelectItem value="Evangelism">Evangelism</SelectItem>
                <SelectItem value="Event Co-ordination">Event Co-ordination</SelectItem>
                <SelectItem value="First Timers ">First Timers</SelectItem>
                <SelectItem value="Live Streaming">Live Streaming</SelectItem>
                <SelectItem value="Media Production">Media Production</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Offering">Offering</SelectItem>
                <SelectItem value="Outreach">Outreach</SelectItem>
                <SelectItem value="Prayer">Prayer</SelectItem>
                <SelectItem value="Program Outline">Program Outline</SelectItem>
                <SelectItem value="Protocol ">Protocol </SelectItem>
                <SelectItem value="Retention">Retention</SelectItem>
                <SelectItem value="Scent Management">Scent Management</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Special Events">Special Events</SelectItem>
                <SelectItem value="Storeroom">Storeroom</SelectItem>
                <SelectItem value="Tithing">Tithing</SelectItem>
                <SelectItem value="Washroom">Washroom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
