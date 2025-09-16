import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to admin theme settings by default
  redirect('/admin/settings/theme');
}
