# RLS Staging Validation Checklist (Phase 1)

- Confirm tenant resolver works on staging domains and returns `req.tenantId`.
- Verify CRUD for tenant content models under RLS:
  - Theme, Bio, ContactInfo, Member, Show, Video, FeaturedVideo, FeaturedRelease, MediaImage, HomeImage, MerchConfig, ShowsSettings, SpotifyPlayer.
  - Create, Read, Update, Delete each at least once.
- Negative tests (cross-tenant):
  - Use Tenant A token, attempt to access Tenant B resource ID → expect 0 rows / permission denied.
- Auth/session flows:
  - Login, refresh, logout; sessions unaffected (User/Session excluded in Phase 1).
- Newsletter/email:
  - Send content notifications with suppression prefilter on/off.
  - SES webhooks (bounce/complaint) still deactivate subscriber(s) and add to SES suppression.
- Scripts:
  - Run seed/provisioning for the staging tenant; tenant-scoped writes succeed under RLS.
- Monitoring/logs:
  - Watch for `permission denied` errors indicating missing GUC or policy gaps.
- Rollback plan:
  - To disable RLS quickly: `ALTER TABLE ... DISABLE ROW LEVEL SECURITY;` per table if needed.
