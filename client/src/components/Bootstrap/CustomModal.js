import './customModal.css';

import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ modalProps, children, modalButton }) => {

  const { id, label, title } = modalProps;

  const modal = (
    <div className="editMember modal fade" id={id} tabIndex="-1" aria-labelledby={label} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={label}>{title}</h5>

            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="whitesmoke" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
              </svg>
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
  }

  return (
    <>
      {modalButton}

      {renderModal()}

    </>
  );
}

export default Modal;