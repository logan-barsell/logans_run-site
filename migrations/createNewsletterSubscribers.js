const mongoose = require('mongoose');
require('dotenv').config();
const keys = require('../config/keys');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  unsubscribeToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  preferences: {
    receiveAutomaticNotifications: {
      type: Boolean,
      default: true,
    },
    notifyOnNewShows: {
      type: Boolean,
      default: true,
    },
    notifyOnNewMusic: {
      type: Boolean,
      default: true,
    },
    notifyOnNewVideos: {
      type: Boolean,
      default: true,
    },
  },
  signupSource: {
    type: String,
    enum: ['website', 'admin', 'import'],
    default: 'website',
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
  },
  unsubscribedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsletterSubscriber = mongoose.model(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);

async function createNewsletterSubscribers() {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Create indexes for the newsletter subscribers collection
    await NewsletterSubscriber.createIndexes();

    console.log(
      'Newsletter subscribers collection and indexes created successfully'
    );

    // Check if there are any existing subscribers (for migration purposes)
    const subscriberCount = await NewsletterSubscriber.countDocuments();
    console.log(`Found ${subscriberCount} existing newsletter subscribers`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  createNewsletterSubscribers();
}

module.exports = createNewsletterSubscribers;
