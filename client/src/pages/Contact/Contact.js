import './Contact.css';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import facebook from '../../images/icons/facebook.svg';
import insta from '../../images/icons/instagram.svg';
import youtube from '../../images/icons/youtube.svg';
import soundcloud from '../../images/icons/soundcloud.svg';
import spotify from '../../images/icons/spotify.svg';

const ContactPage = ({ fetchContactInfo, contactInfo }) => {
  useEffect(() => {
    fetchContactInfo();
  }, []);

  return contactInfo[0] ? (
    <div
      className='container fadeIn'
      id='contact'
    >
      <div className='row'>
        <div className='col-lg'>
          <div className='jumbotron p-sm-5'>
            <h5>Contact Information</h5>
            <hr className='my-4' />
            <p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='33'
                height='33'
                fill='white'
                className='bi bi-telephone-fill'
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z'
                />
              </svg>
              <a href={`tel:+${contactInfo[0].phone}`}>Text/Call</a>
            </p>
            <hr className='my-4' />
            <p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='33'
                height='33'
                fill='white'
                className='bi bi-envelope-fill'
                viewBox='0 0 16 16'
              >
                <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z' />
              </svg>
              <a href={`mailto:${contactInfo[0].email}`}>
                {contactInfo[0].email.split('@')[0]}
                <span className='at@'>@</span>Send Email
              </a>
            </p>
            <hr className='my-4' />
            <div className='socmed contact'>
              <a
                className='hvr-grow'
                href={contactInfo[0].facebook}
                target='_blank'
                rel='noreferrer'
              >
                <img
                  src={facebook}
                  alt='facebook'
                />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].instagram}
                target='_blank'
                rel='noreferrer'
              >
                <img
                  src={insta}
                  alt='instagram'
                />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].youtube}
                target='_blank'
                rel='noreferrer'
              >
                <img
                  src={youtube}
                  alt='youtube'
                />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].soundcloud}
                target='_blank'
                rel='noreferrer'
              >
                <img
                  src={soundcloud}
                  alt='soundcloud'
                />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].spotify}
                target='_blank'
                rel='noreferrer'
              >
                <img
                  src={spotify}
                  alt='spotify'
                />
              </a>
            </div>
          </div>
        </div>
        <div className='col-lg sendmsg'>
          <form
            action='https://formspree.io/contact@logansrun.com'
            method='POST'
          >
            <div className='form-group'>
              <label htmlFor='emailAddress'>Email address</label>
              <input
                className='form-control'
                id='emailAddress'
                type='email'
                name='email'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='subject'>Subject</label>
              <input
                className='form-control'
                id='subject'
                name='subject'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>Message</label>
              <textarea
                className='form-control'
                id='message'
                name='message'
                rows='3'
              ></textarea>
            </div>
            <div className='d-grid gap-2'>
              <button
                className='btn btn-primary btn-danger'
                type='submit'
                value='send'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

function mapStateToProps({ contactInfo }) {
  return { contactInfo };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactPage);
