"use client"

import type React from "react"

import { useState } from "react"
import {
  CheckCircle,
  MapPin,
  DollarSign,
  MessageCircle,
  Link2,
  Star,
  Upload,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react"

const CULTURES = ["buddhist", "gurung", "limbu", "newari", "tamang", "hindu", "tibetan"]
const SERVICE_TYPES = ["Hotel", "Homestay", "Guide"]

interface FormData {
  id: string
  name: string
  type: string
  location: string
  culture: string
  description: string
  pricePerNight?: number
  pricePerDay?: number
  rating: number
  bookingEnabled: boolean
  booking_link: string
  whatsappPhone: string
  whatsappMessage: string
}

export function ServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    type: "Hotel",
    location: "",
    culture: "buddhist",
    description: "",
    rating: 4.5,
    bookingEnabled: false,
    booking_link: "",
    whatsappPhone: "",
    whatsappMessage: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Service name is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.type === "Guide" && !formData.pricePerDay) newErrors.pricePerDay = "Price per day is required"
    if (["Hotel", "Homestay"].includes(formData.type) && !formData.pricePerNight)
      newErrors.pricePerNight = "Price per night is required"
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = "Rating must be between 1-5"
    if (formData.bookingEnabled && !formData.booking_link.trim())
      newErrors.booking_link = "Booking link required if enabled"
    if (!formData.whatsappPhone.trim()) newErrors.whatsappPhone = "WhatsApp number is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setSubmitted(true)
      const jsonData = JSON.stringify(formData, null, 2)
      console.log("Service Data:", jsonData)
      setTimeout(() => setSubmitted(false), 4000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      [name]:
        name === "pricePerNight" || name === "pricePerDay" || name === "rating" ? Number.parseFloat(value) : value,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white/20 dark:border-slate-700/20 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-secondary" />
              Register Your Service
            </h2>
            <p className="text-muted-foreground md:max-w-xl">
              Join Heritage Hub Nepal's network. Fill in your details below and start receiving bookings from travelers
              worldwide.
            </p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-slate-800/20 dark:hover:bg-slate-700/30 transition-all duration-300 text-sm font-medium"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Hide" : "Show"} Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Type & Name - Animated Section */}
          <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Service Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-foreground transition-all duration-300 hover:border-white/50 dark:hover:border-slate-700/50"
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Himalayan Eco Lodge"
                  className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
              </div>
            </div>
          </div>

          {/* Location & Culture */}
          <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Namobuddha, Dhulikhel"
                  className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                    errors.location
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                  }`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-2 font-medium">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Cultural Heritage
                </label>
                <select
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-foreground transition-all duration-300 hover:border-white/50 dark:hover:border-slate-700/50"
                >
                  {CULTURES.map((culture) => (
                    <option key={culture} value={culture}>
                      {culture.charAt(0).toUpperCase() + culture.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service, amenities, and unique offerings..."
              rows={4}
              className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 resize-none text-foreground placeholder:text-muted-foreground/50 ${
                errors.description
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
          </div>

          {/* Pricing */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.type === "Guide" ? (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> Price per Day (USD)
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay || ""}
                    onChange={handleChange}
                    placeholder="e.g., 45"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                      errors.pricePerDay
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                    }`}
                  />
                  {errors.pricePerDay && <p className="text-red-500 text-xs mt-2 font-medium">{errors.pricePerDay}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> Price per Night (USD)
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight || ""}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    step="0.01"
                    className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                      errors.pricePerNight
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                    }`}
                  />
                  {errors.pricePerNight && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.pricePerNight}</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" /> Rating (1-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  step="0.1"
                  className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                    errors.rating
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                  }`}
                />
                {errors.rating && <p className="text-red-500 text-xs mt-2 font-medium">{errors.rating}</p>}
              </div>
            </div>
          </div>

          {/* Booking Links */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-xl border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bookingEnabled"
                  name="bookingEnabled"
                  checked={formData.bookingEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="bookingEnabled" className="text-sm font-semibold text-foreground cursor-pointer">
                  Enable Booking.com Integration
                </label>
              </div>
              {formData.bookingEnabled && (
                <div className="opacity-0 animate-fade-in-up">
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" /> Booking.com Link
                  </label>
                  <input
                    type="url"
                    name="booking_link"
                    value={formData.booking_link}
                    onChange={handleChange}
                    placeholder="https://www.booking.com?aid=BOOKING_ID&hotel_id=..."
                    className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                      errors.booking_link
                        ? "border-red-500 focus:ring-red-500/50"
                        : "border-white/30 dark:border-slate-700/30 focus:ring-primary/50 hover:border-white/50 dark:hover:border-slate-700/50"
                    }`}
                  />
                  {errors.booking_link && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{errors.booking_link}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Booking */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-100/50 dark:border-green-900/30">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> WhatsApp Booking
              </h3>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappPhone"
                  value={formData.whatsappPhone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXXX"
                  className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground/50 ${
                    errors.whatsappPhone
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-green-200 dark:border-green-900/50 focus:ring-green-500/50 hover:border-green-300 dark:hover:border-green-800"
                  }`}
                />
                {errors.whatsappPhone && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.whatsappPhone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">WhatsApp Message Template</label>
                <textarea
                  name="whatsappMessage"
                  value={formData.whatsappMessage}
                  onChange={handleChange}
                  placeholder="Hi! I'd like to book your service for my Nepal trek..."
                  rows={2}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-green-200 dark:border-green-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent resize-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
            <Upload className="w-5 h-5" />
            <span>Submit Service</span>
          </button>
        </div>

        {/* Preview Card */}
        <div
          className={`lg:col-span-1 opacity-0 animate-fade-in-up ${showPreview ? "block" : "hidden lg:block"}`}
          style={{ animationDelay: "0.7s" }}
        >
          <div className="sticky top-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Live Preview</h3>
            <div className="card-gradient rounded-2xl overflow-hidden shadow-2xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
              {/* Service Type Badge */}
              <div className="bg-gradient-to-r from-primary to-secondary p-4">
                <div className="text-xs font-bold text-primary-foreground uppercase tracking-widest opacity-90">
                  {formData.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-foreground text-lg leading-tight">{formData.name || "Service Name"}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{formData.location || "Location"}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/20 dark:border-slate-700/20">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 transition-transform duration-300 ${
                          i < Math.floor(formData.rating) ? "fill-secondary text-secondary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground ml-auto">{formData.rating}</span>
                </div>

                {/* Price Badge */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
                  <div className="text-sm font-bold text-primary">
                    {formData.type === "Guide"
                      ? `$${formData.pricePerDay || "0"}/day`
                      : `$${formData.pricePerNight || "0"}/night`}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {formData.description || "Your service description will appear here..."}
                </p>

                {/* Culture Badge */}
                <div className="pt-2">
                  <span className="inline-block text-xs font-bold text-primary-foreground bg-gradient-to-r from-primary to-secondary px-3 py-1.5 rounded-full">
                    {formData.culture}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900/30 rounded-xl flex items-start gap-3 animate-slide-in-right shadow-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-green-900 dark:text-green-100">
                    Service submitted successfully!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-200 mt-1">
                    Check console for JSON export. Your service is now live!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
