import React, { useRef, useState } from 'react';
import CustomModal from '../Modals/CustomModal';
import Button from '../Button/Button';
import { Envelope } from '../../components/icons';
import { useAlert } from '../../contexts/AlertContext';
import { signupNewsletter } from '../../services/contactService';

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
        // Close the modal on successful subscription
        const modal = document.getElementById('newsletterModal');
        if (modal) {
          // Use Bootstrap's modal API if available
          if (window.bootstrap && window.bootstrap.Modal) {
            const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
              bootstrapModal.hide();
            }
          } else {
            // Fallback: manually hide the modal
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        }
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

  const modalProps = {
    id: 'newsletterModal',
    label: 'newsletterModalLabel',
    title: 'NewsLetter',
  };

  const modalButton = (
    <Button
      id='subscribe'
      type='button'
      size='sm'
      className='mx-sm-3'
      variant='danger'
      data-bs-toggle='modal'
      data-bs-target='#newsletterModal'
      icon={<Envelope />}
      iconPosition='left'
    >
      Newsletter
    </Button>
  );

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={modalButton}
    >
      <form
        className='form-inline newsletter justify-content-center'
        onSubmit={sendNewsletter}
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
            <li>
              Recieve updates on new music releases, music videos, and vlogs
            </li>
            <li>Be notified of special deals, new merch, and giveaways</li>
          </ul>
        </div>
        <div className='modal-footer'>
          <Button
            type='button'
            variant='dark'
            data-bs-dismiss='modal'
            disabled={isSubmitting}
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
    </CustomModal>
  );
};

export default NewsletterModal;
