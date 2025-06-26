import './BottomNav.css';

import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import NavLink from '../Routing/NavLink';
import emailjs from '@emailjs/browser';

const BottomNav = ({ routes, fetchContactInfo, contactInfo }) => {
  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

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

  return (
    <>
      <nav
        id='bottomNav'
        className='navbar navbar-light justify-content-center'
      >
        {/* Button trigger modal */}
        <div className='col-md-7'>
          <div className='row justify-content-center'>
            <div className='col-auto'>
              <button
                id='subscribe'
                type='button'
                className='btn btn-sm btn-danger mx-sm-3'
                data-bs-toggle='modal'
                data-bs-target='#newsletterModal'
              >
                Join the run
              </button>
            </div>
          </div>
        </div>

        {/* Modal  */}
        <div
          className='modal fade'
          id='newsletterModal'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header'>
                <h5
                  className='modal-title'
                  id='exampleModalLongTitle'
                >
                  Join the run
                </h5>

                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='25'
                    height='25'
                    fill='whitesmoke'
                    className='bi bi-x-lg'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fillRule='evenodd'
                      d='M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z'
                    />
                    <path
                      fillRule='evenodd'
                      d='M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z'
                    />
                  </svg>
                </button>
              </div>
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
                      required=''
                    />
                  </div>

                  <ul id='newsDetails'>
                    <li>Stay informed on all upcoming events</li>
                    <li>
                      Recieve updates on new music releases, music videos, and
                      vlogs
                    </li>
                    <li>
                      Be notified of special deals, new merch, and giveaways
                    </li>
                  </ul>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-dark'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                  <button
                    id='newsSub'
                    className='btn btn-outline-light my-2 my-sm-0'
                    value='send'
                    type='submit'
                  >
                    Become a runner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {contactInfo[0] && (
          <div className='iconsNav col-auto justify-content-center mx-auto'>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].facebook}
            >
              {/* <img
                className='hvr-grow'
                src={facebook}
                alt=''
              /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                fill='currentColor'
                className='bi bi-facebook'
                viewBox='0 0 16 16'
              >
                <path d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z' />
              </svg>
            </a>
            <a
              className='w'
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].instagram}
            >
              {/* <img
                className='hvr-grow'
                src={insta}
                alt=''
              /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                fill='currentColor'
                className='bi bi-instagram'
                viewBox='0 0 16 16'
              >
                <path d='M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z' />
              </svg>
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].youtube}
            >
              {/* <img
                className='hvr-grow'
                src={youtube}
                alt=''
              /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                fill='currentColor'
                className='bi bi-youtube'
                viewBox='0 0 16 16'
              >
                <path d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z' />
              </svg>
            </a>
            {/* <a
              className='w'
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].soundcloud}
            >
              <img
                className='hvr-grow'
                src={soundcloud}
                alt=''
              />
            </a> */}
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].spotify}
            >
              {/* <img
                className='hvr-grow'
                src={spotify}
                alt=''
              /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                fill='currentColor'
                className='bi bi-spotify'
                viewBox='0 0 16 16'
              >
                <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z' />
              </svg>
            </a>
          </div>
        )}
      </nav>
      <footer className='page-footer font-small pt-4'>
        {/* Footer Links */}
        <div className='container-fluid text-center text-md-left'>
          <div className='row'>
            <div className='col-md-7'>
              <h5 className='text-uppercase'>HELLO.</h5>
              <p
                className='secondary-font'
                style={{ fontSize: '16px' }}
              >
                Welcome to the run.
              </p>
            </div>
            <div className='col-md-5'>
              <h5 className='text-uppercase'>Links</h5>
              <ul
                id='footer-links'
                className='list-unstyled'
              >
                <li>
                  <NavLink
                    routes={routes}
                    menuToggle={false}
                    footer={true}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className='footer-copyright pb-1 pt-2 text-center bg-light'>
          <p>
            © {String(new Date().getFullYear()).replace('0', 'O')} Copyright{' '}
            <a
              style={{ display: 'inline-block' }}
              href='.'
            >
              logans-run.com
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

function mapStateToProps({ contactInfo }) {
  return { contactInfo };
}

export default connect(mapStateToProps, { fetchContactInfo })(BottomNav);
