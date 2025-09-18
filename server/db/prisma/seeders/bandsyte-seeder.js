// db/prisma/seeders/bandsyte-seeder.js
// Seeds the official Bandsyte tenant with admin user, theme, contact info, and bio
// Usage: node db/prisma/seeders/bandsyte-seeder.js
//
// ⚠️  WARNING: This seeder should only be run once during initial setup!
// Running multiple times will cause unique constraint violations.

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { withTenant } = require('../../withTenant');
const bcrypt = require('bcrypt');

// Use owner database URL to bypass RLS for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OWNER_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

// Fixed Bandsyte tenant ID - this should be consistent across all environments
const BANDSYTE_TENANT_ID = '3cbdf7a0-e8c6-407d-97db-3dc9d12bb33b';

async function seedBandsyteTenant() {
  console.log('🌱 Starting Bandsyte tenant seeding...');

  try {
    // 1. Create or update the Bandsyte tenant
    const tenant = await prisma.tenant.upsert({
      where: { id: BANDSYTE_TENANT_ID },
      update: {
        subDomain: null, // No subdomain for bandsyte.com
        domain: 'bandsyte.com',
        isCustomDomain: false,
      },
      create: {
        id: BANDSYTE_TENANT_ID,
        subDomain: null,
        domain: 'bandsyte.com',
        isCustomDomain: false,
      },
    });
    console.log('✅ Bandsyte tenant created/updated');

    // 2. Create admin user
    const hashedPassword = await bcrypt.hash('Bandsyte!1', 10);
    const adminUser = await prisma.user.upsert({
      where: { adminEmail: 'admin@bandsyte.com' },
      update: {
        tenantId: BANDSYTE_TENANT_ID,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        adminPhone: '9252627761',
      },
      create: {
        adminEmail: 'admin@bandsyte.com',
        tenantId: BANDSYTE_TENANT_ID,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        adminPhone: '9252627761',
      },
    });
    console.log('✅ Admin user created/updated:', adminUser.adminEmail);

    // 3. Seed theme data using withTenant
    await withTenant(BANDSYTE_TENANT_ID, async tx => {
      const themeData = {
        backgroundColor: 'GRAY',
        bandLogoUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/3cbdf7a0-e8c6-407d-97db-3dc9d12bb33b%2Fimages%2F1758058593911_BANDSYTE_ICON_LOGO.png?alt=media&token=d77b522f-c54a-4729-b634-ff160a4d8891',
        enableNewsletter: false,
        greeting: 'Welcome to Bandsyte',
        headerDisplay: 'HEADER_LOGO_ONLY',
        headerPosition: 'CENTER',
        introduction:
          'The ultimate platform for bands to showcase their music, connect with fans, and grow their audience. Create stunning websites, manage your content, and build your fanbase all in one place.',
        notifyOnNewMusic: false,
        notifyOnNewShows: false,
        notifyOnNewVideos: false,
        paceTheme: 'minimal',
        primaryColor: '#ffffff',
        primaryFont: 'Anton',
        secondaryColor: '#000000',
        secondaryFont: 'Oswald',
        siteTitle: 'Bandsyte',
        socialMediaIconStyle: 'DEFAULT',
        bandHeaderLogoUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/3cbdf7a0-e8c6-407d-97db-3dc9d12bb33b%2Fimages%2F1758056720900_BANDSYTE_HEADER_LOGO.png?alt=media&token=309a2598-657e-4d90-b42e-9262f8040640',
        isDefault: true,
      };

      const theme = await tx.theme.upsert({
        where: { tenantId: BANDSYTE_TENANT_ID },
        update: themeData,
        create: {
          tenantId: BANDSYTE_TENANT_ID,
          ...themeData,
        },
      });
      console.log('✅ Bandsyte theme created/updated');
      return theme;
    });

    // 4. Seed contact info data using withTenant
    await withTenant(BANDSYTE_TENANT_ID, async tx => {
      const contactInfoData = {
        publicEmail: 'hello@bandsyte.com',
        publicPhone: null,
        appleMusic: null,
        facebook: 'https://facebook.com/bandsyte',
        instagram: 'https://instagram.com/bandsyte',
        soundcloud: null,
        spotify: null,
        tiktok: 'https://tiktok.com/@bandsyte',
        x: 'https://x.com/bandsyte',
        youtube: 'https://youtube.com/bandsyte',
      };

      const contactInfo = await tx.contactInfo.upsert({
        where: { tenantId: BANDSYTE_TENANT_ID },
        update: contactInfoData,
        create: {
          tenantId: BANDSYTE_TENANT_ID,
          ...contactInfoData,
        },
      });
      console.log('✅ Bandsyte contact info created/updated');
      return contactInfo;
    });

    // 5. Seed bio data using withTenant
    await withTenant(BANDSYTE_TENANT_ID, async tx => {
      const bioData = {
        text: "Bandsyte is the premier platform for musicians to create stunning websites, manage their content, and connect with fans worldwide. Whether you're an emerging artist or an established band, Bandsyte provides all the tools you need to build your online presence and grow your audience.",
        imageType: 'HEADER_LOGO',
        customImageUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/3cbdf7a0-e8c6-407d-97db-3dc9d12bb33b%2Fimages%2F1758067322276_BANDSYTE_ICON_LOGO_WHITE.png?alt=media&token=91dd5133-b864-4a5f-a39c-d1c6c6990037',
      };

      const bio = await tx.bio.upsert({
        where: { tenantId: BANDSYTE_TENANT_ID },
        update: bioData,
        create: {
          tenantId: BANDSYTE_TENANT_ID,
          ...bioData,
        },
      });
      console.log('✅ Bandsyte bio created/updated');
      return bio;
    });

    console.log('🎉 Bandsyte tenant seeding completed successfully!');
    console.log('');
    console.log('📋 Seeded data:');
    console.log(`   • Tenant: Bandsyte (${tenant.domain})`);
    console.log('   • Admin User: admin@bandsyte.com');
    console.log('   • Theme: Bandsyte default theme');
    console.log('   • Contact Info: Social media and contact details');
    console.log('   • Bio: Company description and branding');
  } catch (error) {
    console.error('❌ Bandsyte tenant seeding failed:', error);
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedBandsyteTenant()
    .then(() => {
      console.log('✨ Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedBandsyteTenant, BANDSYTE_TENANT_ID };
