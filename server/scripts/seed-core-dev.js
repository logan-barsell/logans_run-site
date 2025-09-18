// scripts/seed-core-dev.js
// Usage: node scripts/seed-core-dev.js
// Seeds core singleton tables for the DEV tenant: Tenant (with domain config), ContactInfo, Bio

require('dotenv').config();
const { prisma } = require('../db/prisma');
const { withTenant } = require('../db/withTenant');

async function run() {
  const tenantId = process.env.DEV_TENANT_ID;
  if (!tenantId || tenantId.trim() === '') {
    console.error('DEV_TENANT_ID is missing in your environment. Aborting.');
    process.exit(1);
  }

  const nowIso = '2025-09-08T23:05:35.384Z';
  const fixedDate = new Date(nowIso);

  // 1) Ensure Tenant exists with domain configuration
  const existingTenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  const tenantData = {
    id: tenantId,
    name: 'Dev Band',
    subDomain: 'devband',
    domain: 'devband.bandsyte.com',
    isCustomDomain: false,
  };

  if (!existingTenant) {
    await prisma.tenant.create({
      data: tenantData,
    });
    console.log('Tenant created with domain configuration');
  } else {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subDomain: tenantData.subDomain,
        domain: tenantData.domain,
        isCustomDomain: tenantData.isCustomDomain,
      },
    });
    console.log('Tenant updated with domain configuration');
  }

  // 3) Upsert ContactInfo by unique tenantId
  const contactInfoPayload = {
    publicEmail: 'contact@logans-run.com',
    publicPhone: '(925) 262-7761',
    facebook: 'https://www.facebook.com/LogansRunProject/',
    instagram: 'https://www.instagram.com/_logans__run_/?hl=en',
    youtube: 'https://www.youtube.com/channel/UCn4Urr5pnCRzdvzPPZGDbdg',
    soundcloud: 'https://soundcloud.com/johndoe',
    spotify:
      'https://open.spotify.com/artist/0b8AbfdNkOFy9tYFuWMf13?si=5N4Vn13BTgujf3YAGt4wrQ',
    appleMusic: 'https://music.apple.com/us/album/album-name/123456789',
    x: 'https://x.com/johndo',
    tiktok: 'https://tiktok.com/@johndo',
  };
  await withTenant(tenantId, async tx => {
    const existingContact = await tx.contactInfo.findUnique({
      where: { tenantId },
    });
    if (existingContact) {
      await tx.contactInfo.update({
        where: { tenantId },
        data: {
          publicEmail: contactInfoPayload.publicEmail,
          publicPhone: contactInfoPayload.publicPhone,
          facebook: contactInfoPayload.facebook,
          instagram: contactInfoPayload.instagram,
          youtube: contactInfoPayload.youtube,
          soundcloud: contactInfoPayload.soundcloud,
          spotify: contactInfoPayload.spotify,
          appleMusic: contactInfoPayload.appleMusic,
          x: contactInfoPayload.x,
          tiktok: contactInfoPayload.tiktok,
          updatedAt: fixedDate,
        },
      });
      console.log('ContactInfo updated');
    } else {
      await tx.contactInfo.create({
        data: {
          tenantId,
          publicEmail: contactInfoPayload.publicEmail,
          publicPhone: contactInfoPayload.publicPhone,
          facebook: contactInfoPayload.facebook,
          instagram: contactInfoPayload.instagram,
          youtube: contactInfoPayload.youtube,
          soundcloud: contactInfoPayload.soundcloud,
          spotify: contactInfoPayload.spotify,
          appleMusic: contactInfoPayload.appleMusic,
          x: contactInfoPayload.x,
          tiktok: contactInfoPayload.tiktok,
          createdAt: fixedDate,
          updatedAt: fixedDate,
        },
      });
      console.log('ContactInfo created');
    }
  });

  // 4) Upsert Bio by unique tenantId
  const bioPayload = {
    text: "This is Logan's Run, a high-octane musical force hailing from the vibrant heart of the San Francisco Bay Area. This solo project is the brainchild of Logan Barsell,  multi-talented musician who handles every aspect of the sonic experience, from blistering guitar riffs and thunderous bass lines to explosive drumming and powerhouse vocals.\n\nLogan's Run thrives on a unique blend of influences that encompass punk rock's rebellious spirit, the timeless energy of rock 'n' roll, the raw intensity of grunge, the heavy crunch of metal, and the adventurous soundscapes of alternative rock. With this eclectic mix, Logan's music packs a punch that resonates with a diverse audience of rock enthusiasts.",
    imageType: 'band-logo',
    customImageUrl:
      'https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/1756696090054IMG_1894.jpeg?alt=media&token=a50f0af0-2627-42f5-9583-2ceab97f9e78',
  };
  await withTenant(tenantId, async tx => {
    const existingBio = await tx.bio.findUnique({ where: { tenantId } });
    if (existingBio) {
      await tx.bio.update({
        where: { tenantId },
        data: {
          name: 'Dev Band',
          text: bioPayload.text,
          imageType: bioPayload.imageType,
          customImageUrl: bioPayload.customImageUrl,
          updatedAt: fixedDate,
        },
      });
      console.log('Bio updated');
    } else {
      await tx.bio.create({
        data: {
          tenantId,
          name: 'Dev Band',
          text: bioPayload.text,
          imageType: bioPayload.imageType,
          customImageUrl: bioPayload.customImageUrl,
          createdAt: fixedDate,
          updatedAt: fixedDate,
        },
      });
      console.log('Bio created');
    }
  });

  console.log('Seeding complete.');
}

run()
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
