"use client"

import { useState } from "react"
import { MessageCircle, ExternalLink, Check } from "lucide-react"
import type { Service } from "@/lib/types"

interface QuickBookingProps {
  service: Service
  trekName: string
  dayNumber?: number
}

export function QuickBooking({ service, trekName, dayNumber }: QuickBookingProps) {
  const [bookingStep, setBookingStep] = useState<"initial" | "confirming" | "success">("initial")
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", guests: "1" })

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'm interested in booking ${service.name} for my trek: ${trekName}${
      dayNumber ? ` (Day ${dayNumber})` : ""
    }. I'm a guest of ${guestInfo.guests || "1"} person(s). Can you confirm availability and pricing?`
    const whatsappUrl = `https://wa.me/${service.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setBookingStep("success")
  }

  const handleBookingComClick = () => {
    if (service.bookingUrl) {
      window.open(service.bookingUrl, "_blank")
      setBookingStep("success")
    }
  }

  return (
    <div className="bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-900/60 dark:to-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4">
      {/* Service Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">{service.name}</h3>
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">${service.pricePerNight || service.pricePerDay}</span>
          <span className="text-xs text-muted-foreground">{service.pricePerNight ? "per night" : "per day"}</span>
          {service.rating && (
            <span className="ml-auto text-sm">
              {"⭐".repeat(Math.floor(service.rating))} {service.rating}
            </span>
          )}
        </div>
      </div>

      {bookingStep === "initial" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Number of Guests</label>
            <input
              type="number"
              min="1"
              value={guestInfo.guests}
              onChange={(e) => setGuestInfo({ ...guestInfo, guests: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-white/50 dark:bg-slate-900/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp Booking */}
            {service.whatsapp && (
              <button
                onClick={() => setBookingStep("confirming")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            )}

            {/* Booking.com Link */}
            {service.bookingUrl && (
              <button
                onClick={handleBookingComClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Book Now
              </button>
            )}
          </div>
        </div>
      )}

      {bookingStep === "confirming" && (
        <div className="space-y-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground font-medium">Confirm your booking?</p>
          <p className="text-xs text-muted-foreground">
            We'll open WhatsApp to connect you with {service.name} directly
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBookingStep("initial")}
              className="px-3 py-2 rounded-lg border border-border/50 text-foreground text-sm font-medium hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWhatsAppBooking}
              className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Confirm & Chat
            </button>
          </div>
        </div>
      )}

      {bookingStep === "success" && (
        <div className="space-y-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Booking Initiated!</p>
            <p className="text-xs text-muted-foreground mt-1">Check your browser for the booking confirmation</p>
          </div>
          <button
            onClick={() => setBookingStep("initial")}
            className="w-full px-3 py-2 rounded-lg border border-green-500/30 text-foreground text-sm font-medium hover:bg-green-500/10 transition-colors"
          >
            Book Another Service
          </button>
        </div>
      )}
    </div>
  )
}
