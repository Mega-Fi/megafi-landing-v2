"use client"

import { Home, Sparkles, UserPlus, BookOpen, Sun, Moon } from "lucide-react"
import { FaXTwitter, FaDiscord } from "react-icons/fa6"
import { NavBar } from "@/components/ui/tubelight-navbar"
import TubesCursor from "@/components/ui/tubes-cursor"
import { FeaturesSection } from "@/components/ui/features-section"
import { WaitlistSection } from "@/components/ui/waitlist-section"
import Footer from "@/components/ui/animated-footer"
import { useTheme } from "@/lib/theme-provider"

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  
  const navItems = [
    { name: "Home", url: "#hero", icon: Home },
    { name: "Features", url: "#features", icon: Sparkles },
    { name: "Join", url: "#join", icon: UserPlus },
    { name: "Docs", url: "https://docs.megafi.app/", icon: BookOpen },
  ]

  return (
    <main className="snap-container bg-background">
      {/* Logo - Fixed top left */}
      <div className="fixed bottom-6 left-8 sm:top-6 sm:bottom-auto z-50">
        <img 
          src="/megafi-logo.png" 
          alt="MegaFi Logo" 
          className="h-48 w-auto md:h-60 drop-shadow-2xl"
        />
      </div>
      
      {/* Social Links & Theme Toggle - Fixed top right */}
      <div className="fixed bottom-0 right-8 mb-6 sm:top-0 sm:bottom-auto sm:mb-0 sm:pt-6 z-50 flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-full-moon dark:text-full-moon hover:text-mega-orange transition-colors duration-300 p-2.5 rounded-full bg-night-sky/30 dark:bg-night-sky/30 backdrop-blur-sm border border-full-moon/10 dark:border-full-moon/10 hover:border-mega-orange/30 hover:shadow-lg hover:shadow-mega-orange/20"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Moon className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
        <a
          href="https://x.com/megafi_app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-full-moon dark:text-full-moon hover:text-mega-orange transition-colors duration-300 p-2.5 rounded-full bg-night-sky/30 dark:bg-night-sky/30 backdrop-blur-sm border border-full-moon/10 dark:border-full-moon/10 hover:border-mega-orange/30 hover:shadow-lg hover:shadow-mega-orange/20"
          aria-label="Follow us on X"
        >
          <FaXTwitter className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <a
          href="https://discord.gg/dafqYYwM"
          target="_blank"
          rel="noopener noreferrer"
          className="text-full-moon dark:text-full-moon hover:text-mega-orange transition-colors duration-300 p-2.5 rounded-full bg-night-sky/30 dark:bg-night-sky/30 backdrop-blur-sm border border-full-moon/10 dark:border-full-moon/10 hover:border-mega-orange/30 hover:shadow-lg hover:shadow-mega-orange/20"
          aria-label="Join our Discord"
        >
          <FaDiscord className="w-5 h-5 md:w-6 md:h-6" />
        </a>
      </div>
      
      <NavBar items={navItems} />
      
      {/* Frame 1: Hero Section - Full viewport */}
      <div id="hero" className="snap-section">
        <TubesCursor />
      </div>
      
      {/* Frame 2: Features Section - Full viewport with internal scroll */}
      <section id="features" className="snap-section relative z-10 bg-background overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-20 px-4">
          <FeaturesSection />
        </div>
      </section>
      
      {/* Frame 3: Join + Footer - Combined in single viewport */}
      <div id="join" className="snap-section flex flex-col justify-between bg-background">
        <WaitlistSection />
        <Footer />
      </div>
    </main>
  )
}
