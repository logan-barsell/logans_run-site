// db/prisma/seeders/logans-run-seeder.js
// Seeds the Logan's Run tenant with user, theme, bio, contact info, member, and merch config
// Usage: node db/prisma/seeders/logans-run-seeder.js
//
// ⚠️  WARNING: This seeder should only be run once during initial setup!
// Running multiple times will cause unique constraint violations.

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { withTenant } = require('../../withTenant');

// Use owner database URL to bypass RLS for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OWNER_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

// Fixed Logan's Run tenant ID - this should be consistent across all environments
const LOGANS_RUN_TENANT_ID = '579930bf-ea5b-4b8a-a108-625ae19886ee';

async function seedLogansRunTenant() {
  console.log("🌱 Starting Logan's Run tenant seeding...");

  try {
    // 1. Create or update the Logan's Run tenant
    const tenant = await prisma.tenant.upsert({
      where: { id: LOGANS_RUN_TENANT_ID },
      update: {
        subDomain: 'logansrun',
        domain: 'logansrun.bandsyte.com',
        isCustomDomain: false,
      },
      create: {
        id: LOGANS_RUN_TENANT_ID,
        subDomain: 'logansrun',
        domain: 'logansrun.bandsyte.com',
        isCustomDomain: false,
      },
    });
    console.log("✅ Logan's Run tenant created/updated");

    // 2. Create admin user (using the existing hashed password from the data)
    const adminUser = await prisma.user.upsert({
      where: { adminEmail: 'loganjbars@gmail.com' },
      update: {
        tenantId: LOGANS_RUN_TENANT_ID,
        password:
          '$2b$12$ukG8chIMM75Q6k/2Dcnfr.ajYBzFL72FJ5pGy46o5pPHn5A39.oR2',
        role: 'USER',
        status: 'ACTIVE',
        verified: true,
        invitedByUUID: null,
        deactivatedByUUID: null,
        deactivatedAt: null,
        resetToken: null,
        resetTokenExpiry: null,
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorCodeExpiry: null,
        securityPreferences: { loginAlerts: false },
        isActive: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
        adminPhone: '9252627761',
      },
      create: {
        id: 'f3f0c662-5de9-4d12-bf2c-abdc9bac0416',
        adminEmail: 'loganjbars@gmail.com',
        tenantId: LOGANS_RUN_TENANT_ID,
        password:
          '$2b$12$ukG8chIMM75Q6k/2Dcnfr.ajYBzFL72FJ5pGy46o5pPHn5A39.oR2',
        role: 'USER',
        status: 'ACTIVE',
        verified: true,
        invitedByUUID: null,
        deactivatedByUUID: null,
        deactivatedAt: null,
        resetToken: null,
        resetTokenExpiry: null,
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorCodeExpiry: null,
        securityPreferences: { loginAlerts: false },
        isActive: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
        adminPhone: '9252627761',
      },
    });
    console.log("✅ Logan's Run admin user created/updated:", adminUser.email);

    // 3. Seed theme data using withTenant
    await withTenant(LOGANS_RUN_TENANT_ID, async tx => {
      const themeData = {
        backgroundColor: 'PINK',
        bandLogoUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/band-logo-1750963618550-lr-logo.png?alt=media&token=285b4d06-e127-4ce2-b9f8-aaf7e9f6e8df',
        enableNewsletter: true,
        greeting: 'Hello',
        headerDisplay: 'BAND_NAME_AND_LOGO',
        headerPosition: 'LEFT',
        introduction: 'Welcome to the run',
        notifyOnNewMusic: true,
        notifyOnNewShows: true,
        notifyOnNewVideos: true,
        paceTheme: 'minimal',
        primaryColor: '#e3ff05',
        primaryFont: 'sprayPaint',
        secondaryColor: '#f08080',
        secondaryFont: 'Courier New',
        siteTitle: 'Logans Run',
        socialMediaIconStyle: 'DEFAULT',
        bandHeaderLogoUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/579930bf-ea5b-4b8a-a108-625ae19886ee%2Fimages%2F1757709532954_stones.png?alt=media&token=5a6f73be-f8dc-41b4-9b7a-38739bffa7a9',
        isDefault: false,
      };

      const theme = await tx.theme.upsert({
        where: { tenantId: LOGANS_RUN_TENANT_ID },
        update: themeData,
        create: {
          id: '849b3e36-e9c6-4ffc-aa33-b316aeb3d489',
          tenantId: LOGANS_RUN_TENANT_ID,
          ...themeData,
        },
      });
      console.log("✅ Logan's Run theme created/updated");
      return theme;
    });

    // 4. Seed bio data using withTenant
    await withTenant(LOGANS_RUN_TENANT_ID, async tx => {
      const bioData = {
        text: "This is Logan's Run, a high-octane musical force hailing from the vibrant heart of the San Francisco Bay Area. This solo project is the brainchild of Logan Barsell,  multi-talented musician who handles every aspect of the sonic experience, from blistering guitar riffs and thunderous bass lines to explosive drumming and powerhouse vocals.\n\nLogan's Run thrives on a unique blend of influences that encompass punk rock's rebellious spirit, the timeless energy of rock 'n' roll, the raw intensity of grunge, the heavy crunch of metal, and the adventurous soundscapes of alternative rock. With this eclectic mix, Logan's music packs a punch that resonates with a diverse audience of rock enthusiasts...",
        imageType: 'BAND_LOGO',
        customImageUrl:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/1757451216097yesdevil1.JPG?alt=media&token=810fc21a-0c89-4857-a7df-fd5585d7b1d4',
      };

      const bio = await tx.bio.upsert({
        where: { tenantId: LOGANS_RUN_TENANT_ID },
        update: bioData,
        create: {
          id: 'fa0abf43-fd21-4985-a799-24f538fee4dd',
          tenantId: LOGANS_RUN_TENANT_ID,
          ...bioData,
        },
      });
      console.log("✅ Logan's Run bio created/updated");
      return bio;
    });

    // 5. Seed contact info data using withTenant
    await withTenant(LOGANS_RUN_TENANT_ID, async tx => {
      const contactInfoData = {
        publicEmail: 'loganjbars@gmail.com',
        publicPhone: '(925) 262-7761',
        appleMusic: 'https://music.apple.com/us/album/album-name/123456789',
        facebook: 'https://www.facebook.com/LogansRunProject/',
        instagram: 'https://www.instagram.com/_logans__run_/?hl=en',
        soundcloud: 'https://soundcloud.com/johndoe',
        spotify:
          'https://open.spotify.com/artist/0b8AbfdNkOFy9tYFuWMf13?si=5N4Vn13BTgujf3YAGt4wrQ',
        tiktok: 'https://tiktok.com/@johndo',
        x: 'https://x.com/johndoo',
        youtube: 'https://www.youtube.com/channel/UCn4Urr5pnCRzdvzPPZGDbdg',
      };

      const contactInfo = await tx.contactInfo.upsert({
        where: { tenantId: LOGANS_RUN_TENANT_ID },
        update: contactInfoData,
        create: {
          id: 'cf76afb8-d4bb-420f-bccc-dd2455b45e3b',
          tenantId: LOGANS_RUN_TENANT_ID,
          ...contactInfoData,
        },
      });
      console.log("✅ Logan's Run contact info created/updated");
      return contactInfo;
    });

    // 6. Seed member data using withTenant
    await withTenant(LOGANS_RUN_TENANT_ID, async tx => {
      const memberData = {
        name: 'Logan',
        role: 'Drums',
        bioPic:
          'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/1757451484276ben-allan-nPIEjvX0hwI-unsplash.jpg?alt=media&token=0d7952ab-29d3-4eef-bcb3-09562a685012',
        facebook: 'https://facebook.com/hello',
        instagram: '',
        tiktok: '',
        youtube: '',
        x: '',
      };

      const member = await tx.member.upsert({
        where: { id: '7a8cc66c-00e6-4cbd-bc61-6bfe5dd98b34' },
        update: {
          tenantId: LOGANS_RUN_TENANT_ID,
          ...memberData,
        },
        create: {
          id: '7a8cc66c-00e6-4cbd-bc61-6bfe5dd98b34',
          tenantId: LOGANS_RUN_TENANT_ID,
          ...memberData,
        },
      });
      console.log("✅ Logan's Run member created/updated");
      return member;
    });

    // 7. Seed merch config data using withTenant
    await withTenant(LOGANS_RUN_TENANT_ID, async tx => {
      const merchConfigData = {
        storeType: 'SHOPIFY',
        shopDomain: 'bandsyte-test.myshopify.com',
        storefrontAccessToken: '36edc24128e34fcd81d30091e574a25b',
        collectionId: '310397206689',
        paymentLinkIds: ['buy_btn_1S5uY0EZ0oBJc4T2C92om5uK'],
        publishableKey: 'pk_test_67NIaOXmDJJvtcrV5Ixm8ULr',
        storefrontUrl: 'www.google.com',
      };

      const merchConfig = await tx.merchConfig.upsert({
        where: { tenantId: LOGANS_RUN_TENANT_ID },
        update: merchConfigData,
        create: {
          id: '899d2c02-1c19-4cd6-8295-0be9deedddf0',
          tenantId: LOGANS_RUN_TENANT_ID,
          ...merchConfigData,
        },
      });
      console.log("✅ Logan's Run merch config created/updated");
      return merchConfig;
    });

    console.log("🎉 Logan's Run tenant seeding completed successfully!");
    console.log('');
    console.log('📋 Seeded data:');
    console.log(`   • Tenant: Logan's Run (${tenant.domain})`);
    console.log('   • Admin User: loganjbars@gmail.com');
    console.log("   • Theme: Logan's Run custom theme");
    console.log('   • Bio: Band description and branding');
    console.log('   • Contact Info: Social media and contact details');
    console.log('   • Member: Logan (Drums)');
    console.log('   • Merch Config: Shopify integration');
  } catch (error) {
    console.error("❌ Logan's Run tenant seeding failed:", error);
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedLogansRunTenant()
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

module.exports = { seedLogansRunTenant, LOGANS_RUN_TENANT_ID };
