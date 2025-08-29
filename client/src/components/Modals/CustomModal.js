import './customModal.css';
import { Close } from '../../components/icons';

import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ modalProps, children, modalButton }) => {
  const { id, label, title } = modalProps;

  const modal = (
    <div
      className='editMember modal fade'
      id={id}
      tabIndex='-1'
      aria-labelledby={label}
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5
              className='modal-title'
              id={label}
            >
              {title}
            </h5>

            <button
              type='button'
              className='custom-close-btn'
              data-bs-dismiss='modal'
              aria-label='Close'
            >
              <Close />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    const modalContainer = document.querySelector('.modal-container');
    return createPortal(modal, modalContainer);
  };

  return (
    <>
      {modalButton}

      {renderModal()}
    </>
  );
};

export default Modal;
