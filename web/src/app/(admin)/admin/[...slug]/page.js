import { notFound } from 'next/navigation';

export default function AdminCatchAll() {
  return notFound(); // Will render (admin)/admin/not-found.js with admin layout
}
