import React, { useState, useRef } from 'react';
import { Form } from 'react-final-form';
import { ImageUploadField } from '../Forms/FieldTypes/ImageUpload';
import DeleteItem from '../Modifiers/DeleteItem';
import Button from '../Button/Button';
import { NoContent } from '../Header';
import './editImages.css';

const EditImages = ({
  images = [],
  onUpload,
  onRemove,
  emptyText = 'No Images',
  uploadButtonText = 'Add to Images',
  removeConfirmText = 'Remove this image?',
  multiple = true,
  containerId = '',
  imagesPosition = 'top', // 'top' or 'bottom'
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const imageUploadRef = useRef();

  const onSubmit = async data => {
    const files = data.pic;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await onUpload(files, () => {}); // Pass empty function instead of setUploadProgress
      setUploading(false);
      if (
        imageUploadRef.current &&
        typeof imageUploadRef.current.clear === 'function'
      ) {
        imageUploadRef.current.clear();
      }
      setSelectedFiles(null);
    } catch (err) {
      setUploading(false);
    }
  };

  const getUploadButtonText = () => {
    if (!uploading) return uploadButtonText;
    return 'Uploading...';
  };

  const imagesGrid = (
    <div className='currentImages'>
      {images.length > 0 ? (
        images.map(image => (
          <div
            key={image._id}
            className={`img-container ${
              imagesPosition === 'bottom' ? 'mt-5' : null
            }`}
          >
            <DeleteItem
              item={image}
              onDelete={() => onRemove(image)}
              title='DELETE IMAGE'
              content={removeConfirmText}
              isImage={true}
            />
            <img
              src={image.imgLink}
              alt='img edit'
            />
          </div>
        ))
      ) : (
        <div className='my-5'>
          <NoContent>{emptyText}</NoContent>
        </div>
      )}
    </div>
  );

  return (
    <div
      id={containerId}
      className='edit-images-container'
    >
      {imagesPosition === 'top' && imagesGrid}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, meta }) => (
          <form
            onSubmit={async event => {
              const error = await handleSubmit(event);
              if (error) return error;
              setTimeout(() => {
                if (
                  imageUploadRef.current &&
                  typeof imageUploadRef.current.clear === 'function'
                ) {
                  imageUploadRef.current.clear();
                }
                setSelectedFiles(null);
              }, 1000);
            }}
          >
            <ImageUploadField
              ref={imageUploadRef}
              name='pic'
              setImage={setSelectedFiles}
              multiple={multiple}
            />
            <div className='d-grid mx-3 mt-3'>
              <Button
                disabled={
                  uploading || !selectedFiles || selectedFiles.length === 0
                }
                loading={uploading}
                variant='danger'
                type='submit'
                fullWidth
              >
                {getUploadButtonText()}
              </Button>
            </div>
          </form>
        )}
      />
      {imagesPosition === 'bottom' && imagesGrid}
    </div>
  );
};

export default EditImages;
