const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const keys = require('./config/keys');
const { runMigrations } = require('./migrations/migrationRunner');
const { validateAllSchemas } = require('./utils/schemaValidator');

mongoose.connect(keys.mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', async function () {
  console.log('✅ Database connected successfully');
  // console.log('🔄 Starting database initialization...');

  // // Aggressive database initialization - run migrations and validate schemas
  // try {
  //   console.log('📋 Step 1: Running migrations...');
  //   await runMigrations();
  //   console.log('✅ Migrations completed');

  //   console.log('📋 Step 2: Validating schemas...');
  //   await validateAllSchemas();
  //   console.log('✅ Schema validation completed');

  //   // Double-check theme document
  //   console.log('📋 Step 3: Checking theme document...');
  //   const Theme = require('./models/Theme');
  //   const theme = await Theme.findOne();
  //   if (theme) {
  //     console.log('📊 Theme document found:', {
  //       id: theme._id,
  //       hasPaceTheme: !!theme.paceTheme,
  //       paceTheme: theme.paceTheme,
  //     });

  //     if (!theme.paceTheme) {
  //       console.log('🔧 Fixing missing paceTheme field...');
  //       theme.paceTheme = 'center-atom';
  //       await theme.save();
  //       console.log('✅ paceTheme field added');
  //     }
  //   } else {
  //     console.log('⚠️ No theme document found');
  //   }

  //   console.log('🎉 Database initialization complete');
  // } catch (error) {
  //   console.error('❌ Failed to initialize database:', error);
  //   console.error('❌ Error details:', error.stack);
  //   process.exit(1);
  // }
});

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// Add targeted cache control middleware for theme and favicon requests only
app.use((req, res, next) => {
  // Prevent caching for theme API requests only
  if (
    req.path.includes('/api/theme') ||
    req.path.includes('/api/updateTheme')
  ) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }

  // Only prevent caching for images that are likely favicons (small images or specific paths)
  // This is more targeted and won't affect regular site images
  if (
    req.path.match(/\.(ico)$/i) || // .ico files are typically favicons
    req.path.includes('favicon') || // Files with favicon in the name
    req.path.includes('logo') || // Logo files that might be used as favicons
    (req.path.match(/\.(png|jpg|jpeg|gif|svg)$/i) && req.query.favicon)
  ) {
    // Only if explicitly marked as favicon
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }

  next();
});

app.use('/public', express.static(`public`));

require('./routes/billingRoutes')(app);
require('./routes/homeRoutes')(app);
require('./routes/bioRoutes')(app);
require('./routes/contactRoutes')(app);
require('./routes/mediaRoutes')(app);
require('./routes/musicRoutes')(app);
app.use(require('./routes/themeRoutes'));

app.get('/', (req, res) => {
  res.send('EXPRESS ===> REACT');
});

if (process.env.NODE_ENV === 'production') {
  // express will serve up production assets like our main.js file or main.css file
  app.use(express.static('client/build'));

  //express will serve up the index.html file if it doesnt recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📅 Server started at: ${new Date().toISOString()}`);
  console.log(`🔧 Database migration system: ENABLED`);
});
