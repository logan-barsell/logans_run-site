import React from 'react';
import CustomModal from '../../../components/Bootstrap/CustomModal';

const RemoveImage = ({ item, onDelete }) => {
    const modalProps = {
      id: `del_item_${item._id}`,
      label: `del_item_label_${item._id}`,
      title: `DELETE IMAGE`
    }

    const ModalContent = () => {
      return (
        <>
          <div className="modal-body deleteItem">
            Remove from Home Page?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Cancel</button>
            <button onClick={() => onDelete(item)} type="button" data-bs-dismiss="modal" className="btn btn-danger">
              Delete
            </button>
          </div>
        </>
      )
    };
    
    const DeleteButton = () => {
      return (
        <button 
            type="button" 
            className="btn btn-dark" 
            data-bs-toggle="modal"
            data-bs-target={`#${modalProps.id}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
        </button>
      )
    }

    return (
        <>
            <CustomModal modalProps={modalProps} modalButton={<DeleteButton />}>
                <ModalContent />
            </CustomModal>
        </>
  );
};

export default RemoveImage;