"use client"

import { useState, useMemo } from "react"
import { Filter, MapPin, DollarSign, Star, MessageCircle, BookOpen } from "lucide-react"
import type { Service } from "@/lib/types"

const SERVICES_DATA: Service[] = [
  {
    id: "dhulikhel_eco_lodge",
    name: "Dhulikhel Eco Lodge",
    type: "hotel",
    culture: "buddhist",
    description: "Sustainable eco-lodge with traditional Newari architecture and modern amenities",
    pricePerNight: 50,
    rating: 4.7,
    bookingUrl: "https://www.booking.com?aid=BOOKING_ID&hotel_id=dhulikhel_eco",
    whatsapp: "97714123456",
  },
  {
    id: "arughat_gurung_homestay",
    name: "Arughat Gurung Family Homestay",
    type: "homestay",
    culture: "gurung",
    description: "Authentic Gurung family experience with home-cooked meals and cultural activities",
    pricePerNight: 40,
    rating: 4.8,
    bookingUrl: "https://www.booking.com?aid=BOOKING_ID&hotel_id=arughat_gurung",
    whatsapp: "97715234567",
  },
  {
    id: "ilam_tea_farm_homestay",
    name: "Ilam Tea Farm Family Homestay",
    type: "homestay",
    culture: "limbu",
    description: "Stay with a tea farming family and learn tea cultivation and processing",
    pricePerNight: 30,
    rating: 4.6,
    bookingUrl: "",
    whatsapp: "97716123456",
  },
  {
    id: "namobuddha_buddhist_guide",
    name: "Sakela Didi - Buddhist Spiritual Guide",
    type: "guide",
    culture: "buddhist",
    description: "Experienced spiritual guide specializing in Buddhist pilgrimage routes and monastery traditions",
    pricePerDay: 40,
    rating: 4.9,
    bookingUrl: "",
    whatsapp: "97798123456",
  },
  {
    id: "langtang_tamang_homestay",
    name: "Langtang Tamang Family Lodge",
    type: "homestay",
    culture: "tamang",
    description: "Cozy Tamang family homestay with evening music sessions and traditional meals",
    pricePerNight: 35,
    rating: 4.7,
    bookingUrl: "",
    whatsapp: "97713456789",
  },
  {
    id: "shivapuri_eco_lodge",
    name: "Shivapuri Eco-Retreat Lodge",
    type: "hotel",
    culture: "hindu",
    description: "Eco-friendly lodge in Shivapuri National Park with spiritual ambiance",
    pricePerNight: 48,
    rating: 4.7,
    bookingUrl: "https://www.booking.com?aid=BOOKING_ID&hotel_id=shivapuri_eco",
    whatsapp: "97717123456",
  },
]

const CULTURES = [
  { id: "all", name: "All Cultures", color: "from-gray-500 to-gray-600" },
  { id: "buddhist", name: "Buddhist", color: "from-amber-500 to-orange-500" },
  { id: "gurung", name: "Gurung", color: "from-emerald-500 to-teal-500" },
  { id: "limbu", name: "Limbu", color: "from-green-500 to-emerald-600" },
  { id: "newari", name: "Newari", color: "from-red-500 to-rose-600" },
  { id: "tamang", name: "Tamang", color: "from-blue-500 to-cyan-500" },
  { id: "hindu", name: "Hindu", color: "from-purple-500 to-pink-500" },
  { id: "tibetan", name: "Tibetan", color: "from-orange-500 to-yellow-600" },
]

const SERVICE_TYPES = [
  { id: "all", name: "All Types" },
  { id: "hotel", name: "Hotels" },
  { id: "homestay", name: "Homestays" },
  { id: "guide", name: "Guides" },
]

export function ServiceListing() {
  const [selectedCulture, setSelectedCulture] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const cultureMatch = selectedCulture === "all" || service.culture === selectedCulture
      const typeMatch = selectedType === "all" || service.type === selectedType
      return cultureMatch && typeMatch
    })
  }, [selectedCulture, selectedType])

  const getCultureGradient = (culture: string) => {
    return CULTURES.find((c) => c.id === culture)?.color || "from-gray-500 to-gray-600"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return "🏨"
      case "homestay":
        return "🏡"
      case "guide":
        return "🥾"
      default:
        return "📍"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filter by Cultural Heritage</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {CULTURES.map((culture) => (
            <button
              key={culture.id}
              onClick={() => setSelectedCulture(culture.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCulture === culture.id
                  ? `bg-gradient-to-r ${culture.color} text-white shadow-lg`
                  : "bg-white/50 dark:bg-slate-800/50 text-foreground hover:bg-white/70 dark:hover:bg-slate-700/70 border border-border/50"
              }`}
            >
              {culture.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-sm">Filter by Service Type</h3>
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === type.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white/50 dark:bg-slate-800/50 text-foreground hover:bg-white/70 dark:hover:bg-slate-700/70 border border-border/50"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredServices.length} of {SERVICES_DATA.length} services
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 rounded-xl p-5 hover:shadow-lg hover:border-primary/50 transition-all duration-300 space-y-3"
            >
              {/* Header with Type and Rating */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(service.type)}</span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">{service.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{service.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-foreground">{service.rating}</span>
                  </div>
                </div>
              </div>

              {/* Culture Badge */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCultureGradient(service.culture)}`}
                >
                  {service.culture.charAt(0).toUpperCase() + service.culture.slice(1)}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-foreground/70 line-clamp-2">{service.description}</p>

              {/* Location and Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location details</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <DollarSign className="w-4 h-4" />
                  {service.pricePerNight ? `$${service.pricePerNight}/night` : `$${service.pricePerDay}/day`}
                </div>
              </div>

              {/* Booking Options */}
              <div className="flex gap-2 pt-3 border-t border-white/20">
                {service.bookingUrl && (
                  <a
                    href={service.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium text-center transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                    Booking
                  </a>
                )}
                <a
                  href={`https://wa.me/${service.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium text-center transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
                  Chat
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No services found with selected filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
