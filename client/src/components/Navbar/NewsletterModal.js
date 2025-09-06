import React, { useState } from 'react';
import BaseModal from '../Modals/BaseModal';
import Button from '../Button/Button';
import { Envelope } from '../../components/icons';
import { useAlert } from '../../contexts/AlertContext';
import { signupNewsletter } from '../../services/newsletterService';

// Separate component for the form content
const NewsletterForm = ({
  email,
  setEmail,
  isSubmitting,
  onSubmit,
  closeModal,
}) => (
  <form
    className='form-inline newsletter justify-content-center'
    onSubmit={onSubmit}
  >
    <div className='modal-body'>
      <div className='mx-xs-1 mx-sm-3 me-sm-5 pe-sm-5 final-form input-group'>
        <input
          className='form-control text-truncate'
          name='email'
          type='email'
          placeholder='Enter your email here'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <ul id='newsDetails'>
        <li>Stay informed on all upcoming events</li>
        <li>Recieve updates on new music releases, music videos, and vlogs</li>
        <li>Be notified of special deals, new merch, and giveaways</li>
      </ul>
    </div>
    <div className='modal-footer'>
      <Button
        type='button'
        variant='dark'
        disabled={isSubmitting}
        onClick={closeModal}
      >
        Close
      </Button>
      <Button
        id='newsSub'
        className='my-2 my-sm-0'
        variant='outline-light'
        type='submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Subscribing...' : 'Join'}
      </Button>
    </div>
  </form>
);

const NewsletterModal = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAlert();

  const sendNewsletter = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signupNewsletter(email);

      if (result.success) {
        showSuccess('Thank you for subscribing to our newsletter!');
        setEmail('');
        // Modal will be closed automatically by BaseModal via onSuccess callback
      } else {
        showError(result.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      showError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalButton = (
    <Button
      id='subscribe'
      type='button'
      size='sm'
      className='mx-sm-3'
      variant='danger'
      icon={<Envelope />}
      iconPosition='left'
    >
      Newsletter
    </Button>
  );

  // Handle successful form submission
  const handleSuccess = () => {
    // Modal will be closed automatically by BaseModal
  };

  return (
    <BaseModal
      id='newsletterModal'
      title='Newsletter'
      trigger={modalButton}
      onSuccess={handleSuccess}
    >
      <NewsletterForm
        email={email}
        setEmail={setEmail}
        isSubmitting={isSubmitting}
        onSubmit={sendNewsletter}
      />
    </BaseModal>
  );
};

export default NewsletterModal;
