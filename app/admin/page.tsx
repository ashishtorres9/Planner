import { ServiceForm } from "@/components/service-form"
import { ServiceListing } from "@/components/service-listing"

export const metadata = {
  title: "Service Provider Dashboard - Heritage Hub Nepal",
  description: "Register and manage your accommodation,transport and guiding services",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Premium Header with Animation */}
        <div className="mb-12 opacity-0 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-700/20">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-3">
              Heritage Hub Nepal
            </h1>
            <p className="text-lg text-muted-foreground">Service Provider Excellence Portal</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Manage your accommodation and guiding services with premium tools
            </p>
          </div>
        </div>

        {/* Service Form Container */}
        <div
          className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-900/60 dark:to-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/30 dark:border-slate-700/30 shadow-2xl">
            <ServiceForm />
          </div>
        </div>

        {/* Service Listing Preview */}
        <div
          className="mt-16 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-slate-700/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Registered Services Network</h2>
            <ServiceListing />
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-16 opacity-0 animate-in fade-in duration-500 text-center text-sm text-muted-foreground border-t border-border/50 pt-8"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="mb-2">Need Help?</p>
          <p className="text-xs">support@heritagehubnepal.com | +977 1-4XXXXXX7</p>
        </div>
      </div>
    </div>
  )
}
