import './BottomNav.css';
import facebook from '../../images/icons/facebook.png';
import insta from '../../images/icons/insta.png';
import soundcloud from '../../images/icons/soundcloud.png';
import spotify from '../../images/icons/spotify.png';
import youtube from '../../images/icons/youtube.png';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import NavLink from '../Routing/NavLink';

const BottomNav = ({ routes, fetchContactInfo, contactInfo }) => {
  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

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
                action='https://formspree.io/f/xgegekkd'
                method='POST'
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
              <img
                className='hvr-grow'
                src={facebook}
                alt=''
              />
            </a>
            <a
              className='w'
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].instagram}
            >
              <img
                className='hvr-grow'
                src={insta}
                alt=''
              />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].youtube}
            >
              <img
                className='hvr-grow'
                src={youtube}
                alt=''
              />
            </a>
            <a
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
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].spotify}
            >
              <img
                className='hvr-grow'
                src={spotify}
                alt=''
              />
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
