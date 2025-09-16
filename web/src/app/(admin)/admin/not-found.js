'use client';
import { useRouter } from 'next/navigation';
import NotFound from '../../../components/NotFound/NotFound';

const AdminNotFound = () => {
  const router = useRouter();

  const handleNavigation = path => {
    router.push(path);
  };

  return (
    <NotFound
      variant='admin'
      onNavigate={handleNavigation}
    />
  );
};

export default AdminNotFound;
