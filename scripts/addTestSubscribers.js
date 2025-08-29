const mongoose = require('mongoose');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const keys = require('../config/keys');

// Generate more fake emails for testing pagination
const generateFakeEmails = count => {
  const domains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
  ];
  const firstNames = [
    'alice',
    'bob',
    'carol',
    'david',
    'emma',
    'frank',
    'grace',
    'henry',
    'iris',
    'jack',
    'kate',
    'leo',
    'maya',
    'nick',
    'olivia',
    'paul',
    'quinn',
    'rachel',
    'sam',
    'tina',
    'umar',
    'violet',
    'wade',
    'xena',
    'yuki',
    'zoe',
    'adam',
    'beth',
    'chris',
    'diana',
    'eric',
    'fiona',
    'george',
    'hannah',
    'ian',
    'julia',
    'kevin',
    'lisa',
    'mike',
    'nina',
    'oscar',
    'penny',
    'quinn',
    'rose',
    'steve',
    'tara',
    'ulrich',
    'vera',
    'wade',
    'xander',
  ];
  const lastNames = [
    'johnson',
    'smith',
    'davis',
    'wilson',
    'brown',
    'miller',
    'taylor',
    'anderson',
    'thomas',
    'jackson',
    'white',
    'harris',
    'martin',
    'garcia',
    'rodriguez',
    'lee',
    'walker',
    'hall',
    'allen',
    'young',
    'king',
    'wright',
    'lopez',
    'hill',
    'scott',
    'green',
    'adams',
    'baker',
    'gonzalez',
    'nelson',
    'carter',
    'mitchell',
    'perez',
    'roberts',
    'turner',
    'phillips',
    'campbell',
    'parker',
    'evans',
    'edwards',
    'collins',
    'stewart',
    'sanchez',
    'morris',
    'rogers',
    'reed',
    'cook',
    'morgan',
    'bell',
    'murphy',
  ];

  const emails = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const domain = domains[i % domains.length];
    const suffix =
      Math.floor(i / (firstNames.length * lastNames.length * domains.length)) +
      1;
    const email =
      suffix > 1
        ? `${firstName}.${lastName}${suffix}@${domain}`
        : `${firstName}.${lastName}@${domain}`;
    emails.push(email);
  }
  return emails;
};

const fakeEmails = generateFakeEmails(150); // Generate 150 test subscribers

async function addTestSubscribers() {
  try {
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing test subscribers (optional)
    await NewsletterSubscriber.deleteMany({});
    console.log('Cleared existing subscribers');

    const subscribers = fakeEmails.map((email, index) => ({
      email: email.toLowerCase(),
      isActive: true,
      signupSource: 'website',
      subscribedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Spread out over days
      unsubscribeToken: `test-token-${index}`,
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
    console.log(`✅ Added ${subscribers.length} test subscribers`);

    const count = await NewsletterSubscriber.countDocuments();
    console.log(`Total subscribers in database: ${count}`);

    // Calculate expected pages
    const pages = Math.ceil(count / 20);
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

addTestSubscribers();
