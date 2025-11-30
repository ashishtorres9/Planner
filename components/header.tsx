"use client"

export function Header() {
  return (
    <header className="border-b border-border/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary p-3 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-full h-full">
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Heritage Hub Nepal</h1>
              <p className="text-xs text-accent uppercase tracking-widest font-semibold">Nepal Cultural Journeys</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-primary transition-smooth font-medium text-sm">
              Experiences
            </a>
            <a
              href="/admin"
              className="px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold transition-smooth text-sm"
            >
              Admin
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
