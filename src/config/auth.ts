
// Auth provider configuration
type AuthProvider = 'supabase' | 'mongodb';

export const authConfig = {
  provider: 'mongodb' as AuthProvider,
  mongodb: {
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' // Update this with your deployed backend URL
      : 'http://localhost:5000/api',
  },
  supabase: {
    url: "https://rstdujkrsfecrfmclnwu.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR1amtyc2ZlY3JmbWNsbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTY3NTAsImV4cCI6MjA2NTIzMjc1MH0.nWvm5WFi1maU4dUOv0O7hwSV-4og9XE9UXTP-Ugwfp4"
  }
};

export const isMongoDBAuth = (): boolean => authConfig.provider === 'mongodb';
export const isSupabaseAuth = (): boolean => authConfig.provider === 'supabase';
