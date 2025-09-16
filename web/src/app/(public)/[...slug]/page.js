import { notFound } from 'next/navigation';

export default function PublicCatchAll() {
  return notFound(); // Will render (public)/not-found.js with public layout
}
