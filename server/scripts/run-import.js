#!/usr/bin/env node

// Simple script to run the import with better error handling
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Supabase to MongoDB import...');
console.log('This will export data from Supabase and import it into MongoDB');
console.log('Make sure your MongoDB connection is working and the Supabase edge function is deployed');
console.log('─'.repeat(60));

const importScript = path.join(__dirname, 'import-from-supabase.js');

const child = spawn('node', [importScript], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('error', (error) => {
  console.error('Failed to start import process:', error);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('─'.repeat(60));
    console.log('✅ Import completed successfully!');
    console.log('Your Supabase data has been imported into MongoDB');
  } else {
    console.log('─'.repeat(60));
    console.log('❌ Import failed with exit code:', code);
    console.log('Check the error messages above for details');
  }
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nImport process interrupted');
  child.kill('SIGINT');
  process.exit(1);
});