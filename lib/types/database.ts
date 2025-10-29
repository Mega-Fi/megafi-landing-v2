// Database types for Supabase tables

export interface WaitlistEmail {
  id: string
  email: string
  created_at: string
}

export interface LaunchConfig {
  id: string
  launch_date: string
  updated_at: string
}

// Supabase response types
export type WaitlistEmailInsert = Omit<WaitlistEmail, 'id' | 'created_at'>
export type LaunchConfigRow = LaunchConfig

// Database response types
export interface Database {
  public: {
    Tables: {
      waitlist_emails: {
        Row: WaitlistEmail
        Insert: WaitlistEmailInsert
        Update: Partial<WaitlistEmailInsert>
      }
      launch_config: {
        Row: LaunchConfig
        Insert: Omit<LaunchConfig, 'id' | 'updated_at'>
        Update: Partial<Omit<LaunchConfig, 'id'>>
      }
    }
  }
}

