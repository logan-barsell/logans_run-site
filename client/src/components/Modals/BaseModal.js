import './modal.css';
import { Close } from '../../components/icons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

const BaseModal = ({
  id,
  title,
  children,
  trigger,
  size = 'md',
  className = '',
  onOpen,
  onClose,
  closeOnEscape = true,
  showCloseButton = true,
  centered = true,
  onCloseModal, // Callback to provide closeModal function to children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const bootstrapModalRef = useRef(null);

  // Generate consistent IDs
  const modalId = id || `modal_${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${modalId}_label`;

  // Size classes mapping
  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
  };

  // Handle modal opening
  const handleOpen = useCallback(() => {
    // Use stored Bootstrap Modal instance
    if (bootstrapModalRef.current) {
      bootstrapModalRef.current.show();
    } else {
      // Fallback if Bootstrap not available
      setIsOpen(true);
      onOpen?.();
    }
  }, [onOpen]);

  // Handle modal closing
  const handleClose = useCallback(() => {
    // Use stored Bootstrap Modal instance
    if (bootstrapModalRef.current) {
      bootstrapModalRef.current.hide();
    } else {
      // Fallback if Bootstrap not available
      setIsOpen(false);
      onClose?.();
    }
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = e => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, handleClose]);

  // Initialize Bootstrap Modal instance
  useEffect(() => {
    if (
      modalRef.current &&
      window.bootstrap?.Modal &&
      !bootstrapModalRef.current
    ) {
      bootstrapModalRef.current = new window.bootstrap.Modal(modalRef.current, {
        backdrop: true, // Allow backdrop clicks
        keyboard: closeOnEscape,
        focus: true,
      });
    }

    // Cleanup Bootstrap Modal instance on unmount
    return () => {
      if (bootstrapModalRef.current) {
        bootstrapModalRef.current.dispose();
        bootstrapModalRef.current = null;
      }
    };
  }, [closeOnEscape]);

  // Listen to Bootstrap modal events to sync React state
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const handleShow = () => {
      setIsOpen(true);
      onOpen?.();
    };

    const handleHide = () => {
      setIsOpen(false);
      onClose?.();
    };

    modalElement.addEventListener('show.bs.modal', handleShow);
    modalElement.addEventListener('hide.bs.modal', handleHide);

    return () => {
      modalElement.removeEventListener('show.bs.modal', handleShow);
      modalElement.removeEventListener('hide.bs.modal', handleHide);
    };
  }, [onOpen, onClose]);

  // Cleanup function for orphaned modals/backdrops
  const cleanupOrphanedElements = useCallback(() => {
    // Remove any orphaned modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // Reset body classes
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isOpen) {
        cleanupOrphanedElements();
      }
    };
  }, [isOpen, cleanupOrphanedElements]);

  // Provide closeModal function to children via callback
  useEffect(() => {
    if (onCloseModal) {
      onCloseModal(handleClose);
    }
  }, [onCloseModal, handleClose]);

  // Enhanced children that can receive closeModal function
  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children, {
        closeModal: handleClose,
        ...children.props,
      })
    : children;

  // Render modal content
  const modalContent = (
    <div
      ref={modalRef}
      className={`modal fade ${className}`}
      id={modalId}
      tabIndex='-1'
      aria-labelledby={labelId}
      aria-hidden={!isOpen}
    >
      <div
        className={`modal-dialog ${centered ? 'modal-dialog-centered' : ''} ${
          sizeClasses[size] || ''
        }`}
      >
        <div className='modal-content'>
          {title && (
            <div className='modal-header'>
              <h5
                className='modal-title'
                id={labelId}
              >
                {title}
              </h5>
              {showCloseButton && (
                <button
                  type='button'
                  className='custom-close-btn'
                  aria-label='Close'
                  onClick={handleClose}
                >
                  <Close />
                </button>
              )}
            </div>
          )}
          {enhancedChildren}
        </div>
      </div>
    </div>
  );

  // Find modal container or fallback to document.body
  const renderModal = () => {
    const modalContainer = document.querySelector('.modal-container');
    const target = modalContainer || document.body;

    return createPortal(modalContent, target);
  };

  // Enhanced trigger that supports both programmatic and Bootstrap-style triggers
  const enhancedTrigger =
    trigger &&
    React.cloneElement(trigger, {
      onClick: e => {
        // Call original onClick if it exists
        trigger.props.onClick?.(e);
        // Then open modal
        handleOpen();
      },
    });

  return (
    <>
      {enhancedTrigger}
      {renderModal()}
    </>
  );
};

export default BaseModal;
