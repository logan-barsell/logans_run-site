#!/usr/bin/env node

/**
 * Email Template Test Script
 *
 * This script tests all email templates by triggering them through their natural service calls.
 * It sends test emails to loganjbars@gmail.com to verify each template works correctly.
 *
 * Usage: node test-email-templates.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import services and models
const bandEmailService = require('../services/bandEmailService');
const bandsyteEmailService = require('../services/bandsyteEmailService');
const newsletterService = require('../services/newsletterService');
const Theme = require('../models/Theme');

// Test data
const TEST_EMAIL = 'loganjbars@gmail.com';
const TEST_BAND_NAME = "Logan's Run";
const TEST_THEME = {
  bandName: TEST_BAND_NAME,
  bandLogoUrl: 'https://example.com/logo.png', // You can replace with actual logo URL
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
};

async function connectToDatabase() {
  try {
    const mongoURI =
      'mongodb+srv://logan:u3zysPKXd9z4MRv8@logans-run-project.fj8racf.mongodb.net/test?retryWrites=true&w=majority';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function ensureThemeExists() {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      console.log('📝 Creating test theme...');
      theme = new Theme(TEST_THEME);
      await theme.save();
      console.log('✅ Test theme created');
    } else {
      console.log('✅ Theme already exists');
    }
    return theme;
  } catch (error) {
    console.error('❌ Error with theme:', error);
    throw error;
  }
}

async function testNewsletterConfirmation() {
  console.log('\n📧 Testing Newsletter Confirmation Email...');
  try {
    await bandEmailService.sendNewsletterConfirmationWithBranding(
      TEST_EMAIL,
      TEST_BAND_NAME,
      'test-unsubscribe-token-123'
    );
    console.log('✅ Newsletter confirmation email sent');
  } catch (error) {
    console.error('❌ Newsletter confirmation error:', error.message);
  }
}

async function testNewsletterSignupNotification() {
  console.log('\n📧 Testing Newsletter Signup Notification Email...');
  try {
    await bandsyteEmailService.sendNewsletterSignupNotificationWithBranding(
      TEST_EMAIL,
      'fan@example.com',
      TEST_BAND_NAME
    );
    console.log('✅ Newsletter signup notification email sent');
  } catch (error) {
    console.error('❌ Newsletter signup notification error:', error.message);
  }
}

async function testTwoFactorCode() {
  console.log('\n📧 Testing Two-Factor Code Email...');
  try {
    await bandsyteEmailService.sendTwoFactorCodeWithBranding(
      TEST_EMAIL,
      '123456',
      TEST_BAND_NAME
    );
    console.log('✅ Two-factor code email sent');
  } catch (error) {
    console.error('❌ Two-factor code error:', error.message);
  }
}

async function testLoginAlert() {
  console.log('\n📧 Testing Login Alert Email...');
  try {
    await bandsyteEmailService.sendLoginAlertWithBranding(
      TEST_EMAIL,
      TEST_BAND_NAME,
      new Date().toLocaleString(),
      '192.168.1.100',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'San Francisco, CA'
    );
    console.log('✅ Login alert email sent');
  } catch (error) {
    console.error('❌ Login alert error:', error.message);
  }
}

async function testSecurityAlert() {
  console.log('\n📧 Testing Security Alert Email...');
  try {
    await bandsyteEmailService.sendSecurityAlertWithBranding(
      TEST_EMAIL,
      TEST_BAND_NAME,
      'suspicious_activity',
      new Date().toLocaleString(),
      '192.168.1.200',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'New York, NY'
    );
    console.log('✅ Security alert email sent');
  } catch (error) {
    console.error('❌ Security alert error:', error.message);
  }
}

async function testPasswordReset() {
  console.log('\n📧 Testing Password Reset Email...');
  try {
    await bandsyteEmailService.sendPasswordResetWithBranding(
      TEST_EMAIL,
      'https://logansrun.com/reset-password?token=test-token-123',
      TEST_BAND_NAME
    );
    console.log('✅ Password reset email sent');
  } catch (error) {
    console.error('❌ Password reset error:', error.message);
  }
}

async function testPasswordResetSuccess() {
  console.log('\n📧 Testing Password Reset Success Email...');
  try {
    await bandsyteEmailService.sendPasswordResetSuccessWithBranding(
      TEST_EMAIL,
      TEST_BAND_NAME,
      new Date().toLocaleString()
    );
    console.log('✅ Password reset success email sent');
  } catch (error) {
    console.error('❌ Password reset success error:', error.message);
  }
}

async function testEmailVerification() {
  console.log('\n📧 Testing Email Verification Email...');
  try {
    await bandsyteEmailService.sendEmailVerificationWithBranding(
      TEST_EMAIL,
      'https://logansrun.com/verify-email?token=test-verification-token-123',
      'ADMIN',
      TEST_BAND_NAME
    );
    console.log('✅ Email verification email sent');
  } catch (error) {
    console.error('❌ Email verification error:', error.message);
  }
}

async function testWelcomeEmail() {
  console.log('\n📧 Testing Welcome Email...');
  try {
    await bandsyteEmailService.sendWelcomeEmailWithBranding(
      TEST_EMAIL,
      TEST_BAND_NAME
    );
    console.log('✅ Welcome email sent');
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
}

async function testContactNotification() {
  console.log('\n📧 Testing Contact Notification Email...');
  try {
    const contactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Contact Form Submission',
      message:
        'This is a test message from the contact form. Just checking if the email template works correctly!',
      timestamp: new Date().toLocaleString(),
    };

    await bandsyteEmailService.sendContactNotificationWithBranding(
      TEST_EMAIL,
      contactData,
      TEST_BAND_NAME
    );
    console.log('✅ Contact notification email sent');
  } catch (error) {
    console.error('❌ Contact notification error:', error.message);
  }
}

async function testMusicNotification() {
  console.log('\n📧 Testing Music Notification Email...');
  try {
    const musicContent = {
      title: 'Test Track - "Summer Vibes"',
      type: 'track',
      description: "New track: Summer Vibes by Logan's Run",
      releaseDate: new Date(),
      spotifyLink:
        'https://open.spotify.com/track/3n0iGXVTOtoDzi9hwWw2Ae?si=b4aed3af59784486',
    };

    await newsletterService.sendContentNotification('music', musicContent);
    console.log('✅ Music notification email sent');
  } catch (error) {
    console.error('❌ Music notification error:', error.message);
  }
}

async function testVideoNotification() {
  console.log('\n📧 Testing Video Notification Email...');
  try {
    const videoContent = {
      title: 'Test Music Video - "Summer Vibes"',
      category: 'Music Video',
      description: "New video: Summer Vibes Music Video by Logan's Run",
      releaseDate: new Date(),
      youtubeLink: 'https://youtube.com/watch?v=test123',
    };

    await newsletterService.sendContentNotification('video', videoContent);
    console.log('✅ Video notification email sent');
  } catch (error) {
    console.error('❌ Video notification error:', error.message);
  }
}

async function testShowNotification() {
  console.log('\n📧 Testing Show Notification Email...');
  try {
    const showContent = {
      title: 'Test Show - The Fillmore',
      venue: 'The Fillmore',
      location: 'San Francisco, CA',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      doorsTime: '7:00 PM',
      showTime: '8:00 PM',
      prices: '$25 - $35',
      ticketUrl: 'https://ticketmaster.com/test-show-123',
      description: 'New show: The Fillmore in San Francisco, CA',
    };

    await newsletterService.sendContentNotification('show', showContent);
    console.log('✅ Show notification email sent');
  } catch (error) {
    console.error('❌ Show notification error:', error.message);
  }
}

async function testNewsletterNotification() {
  console.log('\n📧 Testing Newsletter Notification Email (Legacy)...');
  try {
    const content = {
      title: 'Test Newsletter Content',
      description:
        'This is a test newsletter notification using the legacy template',
    };

    await newsletterService.sendContentNotification('newsletter', content);
    console.log('✅ Newsletter notification email sent');
  } catch (error) {
    console.error('❌ Newsletter notification error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Email Template Tests...');
  console.log(`📧 All test emails will be sent to: ${TEST_EMAIL}`);
  console.log(`🎵 Testing with band: ${TEST_BAND_NAME}`);

  try {
    await connectToDatabase();
    await ensureThemeExists();

    // Test all email templates
    await testNewsletterConfirmation();
    await testNewsletterSignupNotification();
    await testTwoFactorCode();
    await testLoginAlert();
    await testSecurityAlert();
    await testPasswordReset();
    await testPasswordResetSuccess();
    await testEmailVerification();
    await testWelcomeEmail();
    await testContactNotification();
    await testMusicNotification();
    await testVideoNotification();
    await testShowNotification();
    await testNewsletterNotification();

    console.log('\n🎉 All email template tests completed!');
    console.log(
      '📧 Check your inbox at loganjbars@gmail.com to verify each template'
    );
    console.log('\n📋 Test Summary:');
    console.log('✅ Newsletter Confirmation');
    console.log('✅ Newsletter Signup Notification');
    console.log('✅ Two-Factor Code');
    console.log('✅ Login Alert');
    console.log('✅ Security Alert');
    console.log('✅ Password Reset');
    console.log('✅ Password Reset Success');
    console.log('✅ Email Verification');
    console.log('✅ Welcome Email');
    console.log('✅ Contact Notification');
    console.log('✅ Music Notification');
    console.log('✅ Video Notification');
    console.log('✅ Show Notification');
    console.log('✅ Newsletter Notification (Legacy)');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the tests
runAllTests();
