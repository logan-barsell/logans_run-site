'use client';
import { usePublicNavigationContext } from '../../contexts/PublicNavigationProvider';
import NotFound from '../../components/NotFound/NotFound';

const PublicNotFound = () => {
  const { navigate } = usePublicNavigationContext();

  return (
    <NotFound
      variant='public'
      onNavigate={navigate}
    />
  );
};

export default PublicNotFound;
