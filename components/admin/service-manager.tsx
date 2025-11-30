"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/types"

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Service>>({})
  const [filterCulture, setFilterCulture] = useState<string>("")

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("[v0] Error loading services:", error)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    try {
      if (editingId) {
        setServices(services.map((s) => (s.id === editingId ? ({ ...formData, id: editingId } as Service) : s)))
      } else {
        const newService: Service = {
          id: `service-${Date.now()}`,
          name: formData.name || "",
          type: formData.type as any,
          location: formData.location || "",
          description: formData.description || "",
          pricePerNight: formData.pricePerNight || 0,
          bookingEnabled: formData.bookingEnabled || false,
          whatsappPhone: formData.whatsappPhone,
        }
        setServices([...services, newService])
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({})
      alert("Service saved successfully. Update your data/services.json file to persist changes.")
    } catch (error) {
      console.error("[v0] Error saving service:", error)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((s) => s.id !== id))
    }
  }

  const handleEdit = (service: Service) => {
    setFormData(service)
    setEditingId(service.id)
    setShowForm(true)
  }

  const filteredServices = filterCulture ? services.filter((s) => s.type === filterCulture) : services

  const serviceTypes = Array.from(new Set(services.map((s) => s.type)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Services & Bookings</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setFormData({})
            setEditingId(null)
          }}
        >
          Add New Service
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button variant={filterCulture === "" ? "default" : "outline"} size="sm" onClick={() => setFilterCulture("")}>
          All ({services.length})
        </Button>
        {serviceTypes.map((type) => (
          <Button
            key={type}
            variant={filterCulture === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCulture(type)}
          >
            {type} ({services.filter((s) => s.type === type).length})
          </Button>
        ))}
      </div>

      {showForm && (
        <Card className="p-6 border-2 border-primary">
          <h3 className="text-lg font-semibold text-primary mb-4">
            {editingId ? "Edit Service" : "Create New Service"}
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Service Name *</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Type *</label>
                <select
                  value={formData.type || ""}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                >
                  <option value="">Select Type</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Guide">Guide</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">Price Per Night ($)</label>
                <input
                  type="number"
                  value={formData.pricePerNight || ""}
                  onChange={(e) => setFormData({ ...formData, pricePerNight: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-accent mb-1">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-accent mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 97714123456"
                  value={formData.whatsappPhone || ""}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded bg-white/50 text-foreground"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bookingEnabled || false}
                    onChange={(e) => setFormData({ ...formData, bookingEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-accent">Enable Booking.com</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Service</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setFormData({})
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Service List */}
      <div className="grid gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="p-4 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                <p className="text-sm text-accent">
                  {service.type} • {service.location}
                </p>
              </div>
              <span className="text-lg font-bold text-primary">${service.pricePerNight}</span>
            </div>
            <p className="text-sm text-foreground mb-3">{service.description}</p>
            <div className="flex gap-2 items-center flex-wrap">
              <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(service.id)}>
                Delete
              </Button>
              {service.bookingEnabled && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Booking Enabled</span>
              )}
              {service.whatsappPhone && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">WhatsApp Ready</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-muted">No services found. Create one to get started.</p>
        </Card>
      )}
    </div>
  )
}
