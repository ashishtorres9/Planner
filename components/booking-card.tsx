"use client"

import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/types"
import { MessageCircle, ExternalLink } from "lucide-react"

interface BookingCardProps {
  service: Service
}

export function BookingCard({ service }: BookingCardProps) {
  const handleBookingClick = (platform: "booking" | "whatsapp") => {
    if (platform === "booking") {
      const affiliateUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        service.name,
      )}&affiliate_id=${process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || "heritage-hub-nepal"}`
      window.open(affiliateUrl, "_blank")
    } else if (platform === "whatsapp") {
      const message = `Hi! I'm interested in booking "${service.name}". I'm traveling for a 3-day ${service.culture || "cultural"} trek. Could you provide availability, pricing details, and any special offers? Thanks!`
      const whatsappUrl = `https://wa.me/${service.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const typeEmojis = {
    homestay: "🏡",
    hotel: "🏨",
    guide: "🧗",
  }

  const typeIcon = typeEmojis[service.type.toLowerCase() as keyof typeof typeEmojis] || "📍"
  const priceDisplay = service.pricePerDay || service.pricePerNight
  const priceUnit = service.type === "guide" ? "day" : "night"

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg rounded-xl p-5 hover:border-primary/50 border-2 border-transparent transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{typeIcon}</span>
            <h4 className="font-semibold text-foreground text-base">{service.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground space-x-2">
            <span className="font-medium">{service.type.charAt(0).toUpperCase() + service.type.slice(1)}</span>
            <span>•</span>
            <span>
              <span className="text-yellow-500">{"⭐".repeat(Math.round(service.rating || 4.5))}</span>
              <span className="ml-1">({service.rating || 4.5}/5)</span>
            </span>
          </p>
        </div>
        <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-lg whitespace-nowrap ml-2">
          ${priceDisplay}/{priceUnit}
        </span>
      </div>

      <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{service.description}</p>

      <div className="flex gap-3">
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium transition-all duration-300 rounded-xl shadow-md hover:shadow-lg flex-1 text-xs font-semibold rounded-lg h-9 gap-2"
          onClick={() => handleBookingClick("booking")}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Book Now
        </Button>
        {service.whatsapp && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs font-semibold bg-white/50 dark:bg-slate-800/50 border-primary/30 hover:border-primary/50 hover:bg-primary/5 rounded-lg h-9 gap-2 transition-all duration-300"
            onClick={() => handleBookingClick("whatsapp")}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Chat
          </Button>
        )}
      </div>
    </div>
  )
}
