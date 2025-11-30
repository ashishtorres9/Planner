const servicesData = {
  services: [
    {
      id: "homestay-sunuwar-1",
      name: "Sakela Homestay Panchthar",
      type: "homestay",
      culture: "sunuwar",
      pricePerNight: 25,
      rating: 4.8,
      description: "Authentic Sunuwar family homestay with home-cooked meals",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000001",
    },
    {
      id: "guide-sunuwar-1",
      name: "Ramesh - Sunuwar Cultural Guide",
      type: "guide",
      culture: "sunuwar",
      pricePerDay: 35,
      rating: 4.9,
      description: "Expert guide fluent in Sunuwar traditions and language",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000002",
    },
    {
      id: "hotel-sherpa-1",
      name: "Sherpa Peak Hotel Solu",
      type: "hotel",
      culture: "sherpa",
      pricePerNight: 40,
      rating: 4.7,
      description: "Modern hotel with Sherpa hospitality and mountain views",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000003",
    },
    {
      id: "guide-sherpa-1",
      name: "Pemba - Sherpa Trekking Expert",
      type: "guide",
      culture: "sherpa",
      pricePerDay: 45,
      rating: 5.0,
      description: "Experienced Sherpa guide with deep cultural knowledge",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000004",
    },
    {
      id: "homestay-newari-1",
      name: "Newari Cultural Homestay",
      type: "homestay",
      culture: "newari",
      pricePerNight: 30,
      rating: 4.8,
      description: "Traditional Newari architecture with authentic experiences",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000005",
    },
    {
      id: "guide-newari-1",
      name: "Bishnu - Newari Heritage Guide",
      type: "guide",
      culture: "newari",
      pricePerDay: 40,
      rating: 4.8,
      description: "Specialist in Newari art, architecture, and traditions",
      bookingUrl: "https://www.booking.com",
      whatsapp: "+977-9800000006",
    },
  ],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const culture = searchParams.get("culture")

    let services = servicesData.services
    if (culture) {
      services = services.filter((s) => s.culture === culture.toLowerCase())
    }

    return Response.json(services)
  } catch (error) {
    console.error("[v0] Error loading services:", error)
    return Response.json({ error: "Failed to load services" }, { status: 500 })
  }
}
