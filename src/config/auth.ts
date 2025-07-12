

// Auth provider configuration
type AuthProvider = 'supabase' | 'mongodb';

export const authConfig = {
  provider: 'mongodb' as AuthProvider,
  mongodb: {
    apiUrl: 'http://143.244.171.76:5000/api', // Production DigitalOcean droplet IP and port
  },
  supabase: {
    url: "https://rstdujkrsfecrfmclnwu.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR1amtyc2ZlY3JmbWNsbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTY3NTAsImV4cCI6MjA2NTIzMjc1MH0.nWvm5WFi1maU4dUOv0O7hwSV-4og9XE9UXTP-Ugwfp4"
  }
};

export const isMongoDBAuth = (): boolean => authConfig.provider === 'mongodb';
export const isSupabaseAuth = (): boolean => authConfig.provider === 'supabase';
