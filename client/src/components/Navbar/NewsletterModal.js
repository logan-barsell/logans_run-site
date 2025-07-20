import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import CustomModal from '../Modals/CustomModal';
import Button from '../Button/Button';
import { Envelope } from '../../components/icons';

const NewsletterModal = () => {
  const newsletterForm = useRef();

  const sendNewsletter = e => {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_gibfdre', // Service ID
        'template_l2r8dyy', // Newsletter Template ID
        newsletterForm.current,
        'z5UnqtbNDPKNGhoGS' // Public Key
      )
      .then(
        result => {
          alert('Thank you for subscribing!');
          newsletterForm.current.reset();
        },
        error => {
          alert('Failed to subscribe, please try again.');
        }
      );
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
        ref={newsletterForm}
        onSubmit={sendNewsletter}
      >
        <div className='modal-body'>
          <div className='mx-xs-1 mx-sm-3 me-sm-5 pe-sm-5 final-form input-group'>
            <input
              className='form-control text-truncate'
              name='email'
              type='email'
              placeholder='Enter your email here'
              required
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
          >
            Close
          </Button>
          <Button
            id='newsSub'
            className='my-2 my-sm-0'
            variant='outline-light'
            value='send'
            type='submit'
          >
            Join
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default NewsletterModal;
