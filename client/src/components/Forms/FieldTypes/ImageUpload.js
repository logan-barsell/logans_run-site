import './imageUpload.css';

import React, { useState, useEffect } from 'react';
import { Field } from 'react-final-form';

const ImageUpload = ({
  name,
  initialValue,
  setImage,
  multiple = false,
  onChange,
  value,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const isRequired = initialValue ? false : true;

  // Handle value prop for react-final-form compatibility
  useEffect(() => {
    if (value) {
      setSelectedFiles(value);
    }
  }, [value]);

  const renderSelectedFiles = files => {
    if (!files || files.length === 0) return 'No Files Selected';

    if (multiple) {
      if (files.length === 1) {
        return files[0].name;
      } else {
        return `${files.length} files selected`;
      }
    } else {
      return files[0]?.name || 'No File Selected';
    }
  };

  const handleFileChange = ({ target }) => {
    const files = target?.files;
    setSelectedFiles(files);

    // Always call setImage if provided (for backward compatibility)
    if (setImage) {
      setImage(multiple ? files : files[0]);
    }

    // Call onChange if provided (for new EditableForm integration)
    if (onChange) {
      onChange({ target: { name, value: files } });
    }
  };

  return (
    <div className='form-group'>
      <span className='selectedFile'>{renderSelectedFiles(selectedFiles)}</span>
      <div className='fileUpload btn btn-secondary'>
        <span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='25'
            height='25'
            fill='currentColor'
            className='bi bi-camera-fill'
            viewBox='0 0 16 16'
          >
            <path d='M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' />
            <path d='M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828-.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z' />
          </svg>{' '}
          {multiple ? 'Upload Images' : 'Upload Image'}
        </span>
        <input
          className='form-control upload'
          name={name}
          type='file'
          accept='.png, .jpg, .jpeg'
          multiple={multiple}
          onChange={handleFileChange}
          required={isRequired}
        />
      </div>
    </div>
  );
};

// Wrapper component for react-final-form compatibility
const ImageUploadField = ({ name, setImage, multiple = false, ...props }) => {
  return (
    <Field name={name}>
      {({ input: { value, onChange, ...input } }) => (
        <ImageUpload
          {...props}
          name={name}
          value={value}
          onChange={onChange}
          setImage={setImage}
          multiple={multiple}
        />
      )}
    </Field>
  );
};

export default ImageUpload;
export { ImageUploadField };
