const mongoose = require('mongoose');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const keys = require('../config/keys');

// Generate completely unique test emails
const generateUniqueEmails = (startIndex, count) => {
  const domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
  ];
  const prefixes = [
    'user',
    'test',
    'demo',
    'sample',
    'fan',
    'music',
    'band',
    'concert',
    'live',
    'show',
    'rock',
    'jazz',
    'blues',
    'pop',
    'folk',
    'country',
    'electronic',
    'classical',
    'metal',
    'punk',
    'indie',
    'alternative',
    'r&b',
    'hiphop',
    'reggae',
    'soul',
    'funk',
    'disco',
    'techno',
    'house',
    'dubstep',
    'trance',
    'ambient',
    'chill',
    'lofi',
    'synthwave',
    'retrowave',
    'vaporwave',
    'future',
    'past',
    'present',
    'eternal',
    'moment',
    'timeless',
    'classic',
    'modern',
    'vintage',
    'contemporary',
    'traditional',
    'experimental',
  ];
  const suffixes = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
  ];

  const emails = [];
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const prefix = prefixes[index % prefixes.length];
    const suffix =
      suffixes[Math.floor(index / prefixes.length) % suffixes.length];
    const domain = domains[index % domains.length];
    const email = `${prefix}${suffix}@${domain}`;
    emails.push(email);
  }
  return emails;
};

async function addManyTestSubscribers() {
  try {
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to MongoDB');

    // Get current count
    const currentCount = await NewsletterSubscriber.countDocuments();
    console.log(`Current subscribers: ${currentCount}`);

    // Add 200 more subscribers (starting from current count)
    const newEmails = generateUniqueEmails(currentCount, 200);

    const subscribers = newEmails.map((email, index) => ({
      email: email.toLowerCase(),
      isActive: true,
      signupSource: 'website',
      subscribedAt: new Date(
        Date.now() - (currentCount + index) * 24 * 60 * 60 * 1000
      ), // Spread out over days
      unsubscribeToken: `test-token-${currentCount + index}`,
      preferences: {
        receiveAutomaticNotifications: true,
        notifyOnNewShows: Math.random() > 0.3,
        notifyOnNewMusic: Math.random() > 0.3,
        notifyOnNewVideos: Math.random() > 0.3,
      },
      lastEmailSent:
        Math.random() > 0.5
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          : null,
    }));

    await NewsletterSubscriber.insertMany(subscribers);
    console.log(`✅ Added ${subscribers.length} more test subscribers`);

    const totalCount = await NewsletterSubscriber.countDocuments();
    console.log(`Total subscribers in database: ${totalCount}`);

    // Calculate expected pages
    const pages = Math.ceil(totalCount / 20);
    console.log(
      `Expected pagination: ${pages} pages (20 subscribers per page)`
    );
  } catch (error) {
    console.error('Error adding test subscribers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addManyTestSubscribers();
