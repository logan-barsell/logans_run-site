-- Add isDefault column to Theme table
ALTER TABLE "public"."Theme" ADD COLUMN "isDefault" BOOLEAN DEFAULT false;

-- Create RLS policies for default theme access
-- Allow all tenants to SELECT default themes (for fallback)
CREATE POLICY theme_default_select ON "public"."Theme" 
FOR SELECT USING ("isDefault" = true);

-- Only allow the theme owner (Bandsyte tenant) to manage their default theme
CREATE POLICY theme_default_manage ON "public"."Theme" 
FOR ALL USING (
  "isDefault" = true AND 
  "tenantId" = current_setting('app.tenant_id', true)
);
