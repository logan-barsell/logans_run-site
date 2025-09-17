-- Enable RLS for User table to prevent cross-tenant access
-- This is a critical security fix

-- Enable RLS on User table
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for User table
CREATE POLICY user_tenant_select ON "public"."User" FOR SELECT USING ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY user_tenant_insert ON "public"."User" FOR INSERT WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY user_tenant_update ON "public"."User" FOR UPDATE USING ("tenantId" = current_setting('app.tenant_id', true)) WITH CHECK ("tenantId" = current_setting('app.tenant_id', true));
CREATE POLICY user_tenant_delete ON "public"."User" FOR DELETE USING ("tenantId" = current_setting('app.tenant_id', true));

-- Force RLS on User table
ALTER TABLE "public"."User" FORCE ROW LEVEL SECURITY;
