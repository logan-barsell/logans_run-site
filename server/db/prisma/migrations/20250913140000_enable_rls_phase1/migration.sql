-- Phase 1: Enable RLS for tenant-owned content tables and add tenant policies
-- Notes:
-- - Uses session GUC app.tenant_id set via withTenant() helper
-- - Excludes Tenant, TenantDomain, User, Session, NewsletterSubscriber in Phase 1

-- Helper macro-ish: policy condition
-- Condition: "tenantId" = current_setting('app.tenant_id', true)

-- Theme
ALTER TABLE "public"."Theme" ENABLE ROW LEVEL SECURITY;
CREATE POLICY theme_tenant_select ON "public"."Theme" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY theme_tenant_insert ON "public"."Theme" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY theme_tenant_update ON "public"."Theme" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY theme_tenant_delete ON "public"."Theme" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- Bio
ALTER TABLE "public"."Bio" ENABLE ROW LEVEL SECURITY;
CREATE POLICY bio_tenant_select ON "public"."Bio" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY bio_tenant_insert ON "public"."Bio" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY bio_tenant_update ON "public"."Bio" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY bio_tenant_delete ON "public"."Bio" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- ContactInfo
ALTER TABLE "public"."ContactInfo" ENABLE ROW LEVEL SECURITY;
CREATE POLICY contactinfo_tenant_select ON "public"."ContactInfo" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY contactinfo_tenant_insert ON "public"."ContactInfo" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY contactinfo_tenant_update ON "public"."ContactInfo" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY contactinfo_tenant_delete ON "public"."ContactInfo" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- Member
ALTER TABLE "public"."Member" ENABLE ROW LEVEL SECURITY;
CREATE POLICY member_tenant_select ON "public"."Member" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY member_tenant_insert ON "public"."Member" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY member_tenant_update ON "public"."Member" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY member_tenant_delete ON "public"."Member" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- Show
ALTER TABLE "public"."Show" ENABLE ROW LEVEL SECURITY;
CREATE POLICY show_tenant_select ON "public"."Show" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY show_tenant_insert ON "public"."Show" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY show_tenant_update ON "public"."Show" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY show_tenant_delete ON "public"."Show" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- Video
ALTER TABLE "public"."Video" ENABLE ROW LEVEL SECURITY;
CREATE POLICY video_tenant_select ON "public"."Video" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY video_tenant_insert ON "public"."Video" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY video_tenant_update ON "public"."Video" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY video_tenant_delete ON "public"."Video" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- FeaturedVideo
ALTER TABLE "public"."FeaturedVideo" ENABLE ROW LEVEL SECURITY;
CREATE POLICY featuredvideo_tenant_select ON "public"."FeaturedVideo" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredvideo_tenant_insert ON "public"."FeaturedVideo" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredvideo_tenant_update ON "public"."FeaturedVideo" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredvideo_tenant_delete ON "public"."FeaturedVideo" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- FeaturedRelease
ALTER TABLE "public"."FeaturedRelease" ENABLE ROW LEVEL SECURITY;
CREATE POLICY featuredrelease_tenant_select ON "public"."FeaturedRelease" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredrelease_tenant_insert ON "public"."FeaturedRelease" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredrelease_tenant_update ON "public"."FeaturedRelease" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY featuredrelease_tenant_delete ON "public"."FeaturedRelease" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- MediaImage
ALTER TABLE "public"."MediaImage" ENABLE ROW LEVEL SECURITY;
CREATE POLICY mediaimage_tenant_select ON "public"."MediaImage" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY mediaimage_tenant_insert ON "public"."MediaImage" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY mediaimage_tenant_update ON "public"."MediaImage" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY mediaimage_tenant_delete ON "public"."MediaImage" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- HomeImage
ALTER TABLE "public"."HomeImage" ENABLE ROW LEVEL SECURITY;
CREATE POLICY homeimage_tenant_select ON "public"."HomeImage" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY homeimage_tenant_insert ON "public"."HomeImage" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY homeimage_tenant_update ON "public"."HomeImage" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY homeimage_tenant_delete ON "public"."HomeImage" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- MerchConfig
ALTER TABLE "public"."MerchConfig" ENABLE ROW LEVEL SECURITY;
CREATE POLICY merchconfig_tenant_select ON "public"."MerchConfig" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY merchconfig_tenant_insert ON "public"."MerchConfig" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY merchconfig_tenant_update ON "public"."MerchConfig" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY merchconfig_tenant_delete ON "public"."MerchConfig" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- ShowsSettings
ALTER TABLE "public"."ShowsSettings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY showssettings_tenant_select ON "public"."ShowsSettings" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY showssettings_tenant_insert ON "public"."ShowsSettings" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY showssettings_tenant_update ON "public"."ShowsSettings" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY showssettings_tenant_delete ON "public"."ShowsSettings" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- SpotifyPlayer
ALTER TABLE "public"."SpotifyPlayer" ENABLE ROW LEVEL SECURITY;
CREATE POLICY spotifyplayer_tenant_select ON "public"."SpotifyPlayer" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY spotifyplayer_tenant_insert ON "public"."SpotifyPlayer" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY spotifyplayer_tenant_update ON "public"."SpotifyPlayer" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY spotifyplayer_tenant_delete ON "public"."SpotifyPlayer" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));


