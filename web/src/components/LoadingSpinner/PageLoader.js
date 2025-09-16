import LoadingSpinner from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '500px' }}
    >
      <LoadingSpinner
        size='lg'
        color='white'
        centered={true}
      />
    </div>
  );
};
