#!/usr/bin/env node

/**
 * Generate JWT Secret Utility
 *
 * This script generates a cryptographically secure JWT secret
 * that can be used in your .env file.
 *
 * Usage: node scripts/generateJWTSecret.js
 */

const crypto = require('crypto');

console.log('🔐 Generating JWT Secret...\n');

// Generate a 64-byte (512-bit) random secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated secure JWT secret:');
console.log('='.repeat(80));
console.log(secret);
console.log('='.repeat(80));
console.log('\n📝 Copy this to your .env file as:');
console.log(`JWT_SECRET=${secret}`);
console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('• Keep this secret secure and never share it');
console.log('• Use different secrets for development and production');
console.log('• Store this in your .env file (not in version control)');
console.log('• Rotate this secret periodically in production');
console.log('\n🔒 Security level: 512-bit random (very strong)');
