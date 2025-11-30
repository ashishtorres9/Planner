"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrekManager } from "./admin/trek-manager"
import { ServiceManager } from "./admin/service-manager"
import { AvatarManager } from "./admin/avatar-manager"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"treks" | "services" | "avatars" | "settings">("treks")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent-light/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-accent mt-2">Manage treks, services, and cultural settings</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border pb-4 flex-wrap">
          <Button variant={activeTab === "treks" ? "default" : "outline"} onClick={() => setActiveTab("treks")}>
            Trek Library
          </Button>
          <Button variant={activeTab === "services" ? "default" : "outline"} onClick={() => setActiveTab("services")}>
            Services & Bookings
          </Button>
          <Button variant={activeTab === "avatars" ? "default" : "outline"} onClick={() => setActiveTab("avatars")}>
            Avatars
          </Button>
          <Button variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")}>
            Settings
          </Button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "treks" && <TrekManager />}
          {activeTab === "services" && <ServiceManager />}
          {activeTab === "avatars" && <AvatarManager />}
          {activeTab === "settings" && <SettingsManager />}
        </div>
      </div>
    </div>
  )
}

function SettingsManager() {
  const [affiliateId, setAffiliateId] = useState("")

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">System Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Booking.com Affiliate ID</label>
            <input
              type="text"
              value={affiliateId}
              onChange={(e) => setAffiliateId(e.target.value)}
              placeholder="Your Booking.com affiliate ID"
              className="w-full px-4 py-2 border border-border rounded-lg bg-white/50 text-foreground"
            />
            <p className="text-xs text-muted mt-2">
              This ID is used to generate affiliate links. Add it to your environment variables as
              NEXT_PUBLIC_BOOKING_AFFILIATE_ID
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Deployment Instructions</label>
            <Card className="p-4 bg-accent/5 border-accent">
              <ol className="text-sm text-foreground space-y-2 list-decimal list-inside">
                <li>Export your trek and service data as JSON</li>
                <li>Push changes to your GitHub repository</li>
                <li>Deploy to Vercel with integrated GitHub</li>
                <li>Data updates automatically on each deploy</li>
              </ol>
            </Card>
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Export Data</label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportData("treks")}>
                Export Treks JSON
              </Button>
              <Button variant="outline" onClick={() => exportData("services")}>
                Export Services JSON
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function exportData(type: "treks" | "services") {
  // Mock export - in production would fetch actual data
  const mockData = {
    treks: { treks: [] },
    services: { services: [] },
  }

  const dataStr = JSON.stringify(mockData[type], null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${type}.json`
  link.click()
}
