import { notFound } from 'next/navigation';

export default function AdminCatchAll() {
  console.log('AdminCatchAll');
  return notFound(); // Will render (admin)/admin/not-found.js with admin layout
}
