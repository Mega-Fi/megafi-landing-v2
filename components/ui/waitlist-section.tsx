"use client"

import React from "react"
import type { ReactElement } from "react"
import { useState, useEffect } from "react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export function WaitlistSection(): ReactElement {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupCount, setSignupCount] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Fetch launch date and initialize countdown
  useEffect(() => {
    const fetchLaunchDate = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Using fallback countdown (30 days).')
        // Use fallback: 30 days from now
        const launchDate = new Date().getTime() + (30 * 24 * 60 * 60 * 1000)
        
        const calculateTimeLeft = () => {
          const now = new Date().getTime()
          const difference = launchDate - now

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setTimeLeft({ days, hours, minutes, seconds })
          } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
      }

      try {
        const { data, error } = await supabase
          .from('launch_config')
          .select('launch_date')
          .limit(1)
          .single()

        if (error) {
          console.error('Error fetching launch date:', error)
          return
        }

        if (data?.launch_date) {
          const launchDate = new Date(data.launch_date).getTime()
          
          const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const difference = launchDate - now

            if (difference > 0) {
              const days = Math.floor(difference / (1000 * 60 * 60 * 24))
              const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
              const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
              const seconds = Math.floor((difference % (1000 * 60)) / 1000)

              setTimeLeft({ days, hours, minutes, seconds })
            } else {
              setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
          }

          // Calculate immediately
          calculateTimeLeft()

          // Update every second
          const timer = setInterval(calculateTimeLeft, 1000)
          return () => clearInterval(timer)
        }
      } catch (err) {
        console.error('Error fetching launch date:', err)
      }
    }

    fetchLaunchDate()
  }, [])

  // Fetch signup count
  useEffect(() => {
    const fetchSignupCount = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Using fallback signup count.')
        setSignupCount(0)
        return
      }

      try {
        const { count, error } = await supabase
          .from('waitlist_emails')
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.error('Error fetching signup count:', error)
          return
        }

        setSignupCount(count || 0)
      } catch (err) {
        console.error('Error fetching signup count:', err)
      }
    }

    fetchSignupCount()
  }, [isSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage("")

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setErrorMessage("⚠️ Supabase not configured. Please add your credentials to .env.local")
      setIsSubmitting(false)
      console.error('Supabase environment variables not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      return
    }

    try {
      const { error } = await supabase
        .from('waitlist_emails')
        .insert([{ email: email.toLowerCase().trim() }])

      if (error) {
        // Check for duplicate email error
        if (error.code === '23505') {
          setErrorMessage("This email is already on the waitlist!")
        } else {
          setErrorMessage("Something went wrong. Please try again.")
          console.error('Error submitting email:', error)
        }
        setIsSubmitting(false)
        return
      }

      // Success
      setIsSubmitted(true)
      setIsSubmitting(false)
    } catch (err) {
      console.error('Error submitting email:', err)
      setErrorMessage("Network error. Please check your connection and try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-background w-full flex-1">
      {/* Content Layer */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-[520px]">
          {/* Card with Glowing Effect */}
          <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-3 md:rounded-[2rem] md:p-4">
            <GlowingEffect
              spread={50}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative backdrop-blur-xl bg-card/80 dark:bg-night-sky/40 border border-border rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-8 text-center">
                      <h2 className="text-4xl font-light text-foreground mb-4 tracking-wide">
                        Join the Waitlist
                      </h2>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        Get early access to MegaFi - the next generation
                        <br />
                        decentralized finance platform launching soon
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="flex-1 bg-background/60 dark:bg-black/40 border-border text-foreground placeholder:text-muted-foreground focus:border-mega-orange/40 focus:ring-mega-orange/20 h-12 rounded-xl backdrop-blur-sm"
                        />
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-12 px-6 bg-mega-orange hover:bg-mega-orange/90 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-mega-orange/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Joining..." : "Get Notified"}
                        </Button>
                      </div>
                      {errorMessage && (
                        <p className="mt-3 text-sm text-mega-orange/90 text-center">
                          {errorMessage}
                        </p>
                      )}
                    </form>

                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mega-orange to-mega-orange/60 border-2 border-border flex items-center justify-center text-white text-xs font-medium">
                          M
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/60 border-2 border-border flex items-center justify-center text-background text-xs font-medium">
                          F
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted/80 border-2 border-border flex items-center justify-center text-foreground text-xs font-medium">
                          G
                        </div>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {signupCount > 0 
                          ? `${signupCount.toLocaleString()} ${signupCount === 1 ? 'person' : 'people'} already joined`
                          : 'Be the first to join!'}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-center">
                      <div>
                        <div className="text-2xl font-light text-foreground">{timeLeft.days}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">days</div>
                      </div>
                      <div className="text-muted-foreground/40">|</div>
                      <div>
                        <div className="text-2xl font-light text-foreground">{timeLeft.hours}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">hours</div>
                      </div>
                      <div className="text-muted-foreground/40">|</div>
                      <div>
                        <div className="text-2xl font-light text-foreground">{timeLeft.minutes}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">minutes</div>
                      </div>
                      <div className="text-muted-foreground/40">|</div>
                      <div>
                        <div className="text-2xl font-light text-foreground">{timeLeft.seconds}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">seconds</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-mega-orange/30 to-mega-orange/10 flex items-center justify-center border border-mega-orange/40">
                      <svg
                        className="w-8 h-8 text-mega-orange drop-shadow-lg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 drop-shadow-lg">
                      You&apos;re on the list!
                    </h3>
                    <p className="text-muted-foreground text-sm drop-shadow-md">
                      We&apos;ll notify you when we launch. Thanks for joining!
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-foreground/[0.02] to-foreground/[0.05] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

