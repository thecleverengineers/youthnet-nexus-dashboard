#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting YouthNet Development Environment...\n');

// Start the backend server
console.log('📦 Starting MongoDB Backend Server...');
const backendProcess = spawn('node', ['app.js'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

backendProcess.on('error', (error) => {
  console.error('❌ Backend server error:', error);
});

backendProcess.on('close', (code) => {
  console.log(`🔚 Backend server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  backendProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development environment...');
  backendProcess.kill('SIGTERM');
  process.exit(0);
});