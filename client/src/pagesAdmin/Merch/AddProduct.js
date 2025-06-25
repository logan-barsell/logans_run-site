import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createProduct, fetchProducts } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import editProductFields from './editProductFields';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../firebase';

const AddProduct = ({ createProduct, fetchProducts }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmit = async values => {
    setUploading(true);
    let imageUrl = '';
    if (values.images && values.images.length) {
      const file = values.images[0];
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.floor(progress));
          },
          error => {
            setUploading(false);
            reject(error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }
    // Prepare product data for backend
    const payload = {
      ...values,
      images: imageUrl ? [imageUrl] : [],
      price: Math.round(Number(values.price) * 100),
    };
    await createProduct(payload);
    fetchProducts();
    setUploading(false);
  };

  const modalProps = {
    id: 'add_product',
    label: 'product_label',
    title: 'NEW PRODUCT',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replaceAll('0', 'O')}%`
      : 'Add Product',
  };

  const AddButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='addButton btn btn-danger'
      type='button'
      disabled={uploading}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='currentColor'
        className='bi bi-plus-square-fill'
        viewBox='0 0 16 16'
      >
        <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
      </svg>
      {modalProps.buttonText}
    </button>
  );

  // Use editProductFields with no product for initial values
  const fields = editProductFields({});

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<AddButton />}
    >
      <ModalForm
        fields={fields}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

export default connect(null, { createProduct, fetchProducts })(AddProduct);
