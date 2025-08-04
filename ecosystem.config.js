module.exports = {
  apps: [
    {
      name: 'youthnet-mis',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/var/www/youthnet-mis',
      user: 'youthnet',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        VITE_SUPABASE_URL: 'https://rstdujkrsfecrfmclnwu.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR1amtyc2ZlY3JmbWNsbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTY3NTAsImV4cCI6MjA2NTIzMjc1MH0.nWvm5WFi1maU4dUOv0O7hwSV-4og9XE9UXTP-Ugwfp4',
        LOG_LEVEL: 'error'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      node_args: '--max_old_space_size=4096',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      merge_logs: true,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
      autorestart: true,
      health_check_grace_period: 3000,
      shutdown_with_message: true
    }
  ],

  deploy: {
    production: {
      user: 'youthnet',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/youthnet-mis.git',
      path: '/var/www/youthnet-mis',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --production=false && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};