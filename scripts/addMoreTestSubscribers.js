const mongoose = require('mongoose');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const keys = require('../config/keys');

// Generate unique test emails
const generateUniqueEmails = (startIndex, count) => {
  const domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
  ];
  const firstNames = [
    'alex',
    'blake',
    'casey',
    'drew',
    'emery',
    'finn',
    'gray',
    'hunter',
    'ivy',
    'jordan',
    'kendall',
    'logan',
    'morgan',
    'nash',
    'oliver',
    'parker',
    'quinn',
    'riley',
    'sage',
    'taylor',
    'urban',
    'val',
    'winter',
    'xander',
    'yuki',
    'zara',
    'ash',
    'bay',
    'clay',
    'dove',
    'echo',
    'flint',
    'gale',
    'haze',
    'indigo',
    'jade',
    'kale',
    'lark',
    'moss',
    'nova',
    'ocean',
    'pearl',
    'quill',
    'rain',
    'storm',
    'thunder',
    'umbrella',
    'vapor',
    'whisper',
    'xenon',
  ];
  const lastNames = [
    'adams',
    'baker',
    'clark',
    'davis',
    'evans',
    'foster',
    'garcia',
    'harris',
    'irwin',
    'jones',
    'kelly',
    'lewis',
    'miller',
    'nelson',
    'owens',
    'parker',
    'quinn',
    'reed',
    'smith',
    'taylor',
    'underwood',
    'vance',
    'walker',
    'young',
    'zimmerman',
    'anderson',
    'brown',
    'carter',
    'dixon',
    'edwards',
    'fisher',
    'green',
    'hill',
    'jackson',
    'king',
    'lee',
    'martin',
    'north',
    'patterson',
    'ross',
    'stewart',
    'thompson',
    'white',
    'wright',
    'young',
    'allen',
    'bennett',
    'cooper',
    'davis',
    'edwards',
  ];

  const emails = [];
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const domain = domains[index % domains.length];
    const suffix =
      Math.floor(
        index / (firstNames.length * lastNames.length * domains.length)
      ) + 1;
    const email =
      suffix > 1
        ? `${firstName}.${lastName}${suffix}@${domain}`
        : `${firstName}.${lastName}@${domain}`;
    emails.push(email);
  }
  return emails;
};

async function addMoreTestSubscribers() {
  try {
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to MongoDB');

    // Get current count
    const currentCount = await NewsletterSubscriber.countDocuments();
    console.log(`Current subscribers: ${currentCount}`);

    // Add 100 more subscribers (starting from current count)
    const newEmails = generateUniqueEmails(currentCount, 100);

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

addMoreTestSubscribers();
