export default function CompanyPage() {
  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-8 text-center'>
          <h1 className='display-4 mb-4'>
            Welcome to <strong>Bandsyte</strong>
          </h1>
          <p className='lead mb-4'>
            The complete platform for bands to showcase their music, manage
            their content, and connect with fans. Build your professional band
            website in minutes.
          </p>
          <div className='d-grid gap-2 d-md-flex justify-content-md-center'>
            <a
              href='/company/signup'
              className='btn btn-primary btn-lg'
            >
              Get Started Free
            </a>
            <a
              href='/company/features'
              className='btn btn-outline-primary btn-lg'
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div
        className='alert alert-info mt-5'
        role='alert'
      >
        <strong>Note:</strong> This is a placeholder for the Bandsyte company
        landing page. Full development will begin soon. This will be accessible
        at bandsyte.com via middleware routing.
      </div>
    </div>
  );
}
