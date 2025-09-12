import './imageUpload.css';

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Field } from 'react-final-form';
import { CameraFill } from '../../icons';
import Button from '../../Button/Button';

const ImageUpload = forwardRef(
  (
    {
      name,
      label,
      setImage,
      multiple = false,
      onChange,
      value,
      required = false,
      onFileChange,
    },
    ref
  ) => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const inputRef = useRef();

    // Expose clear() to parent
    useImperativeHandle(ref, () => ({
      clear: () => {
        setSelectedFiles(null);
        if (inputRef.current) inputRef.current.value = null;
        if (setImage) setImage(null);
        if (onChange) onChange({ target: { name, value: null } });
        if (onFileChange) onFileChange(name, null);
      },
    }));

    // Handle value prop for react-final-form compatibility
    // Only set selectedFiles if value is actually a FileList or File object
    // Don't set it for existing image URLs (strings)
    useEffect(() => {
      if (value && (value instanceof FileList || value instanceof File)) {
        setSelectedFiles(value);
      } else if (!value) {
        setSelectedFiles(null);
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

      // Call onFileChange for ModalForm tracking
      if (onFileChange) {
        onFileChange(name, files);
      }
    };

    return (
      <div className='form-group'>
        <span className='selectedFile'>
          {renderSelectedFiles(selectedFiles)}
        </span>
        <Button
          className='fileUpload'
          variant='secondary'
          type='button'
          icon={<CameraFill />}
          iconPosition='left'
          as='label'
        >
          {multiple ? 'Upload Images' : 'Upload Image'}
          <input
            ref={inputRef}
            className='form-control upload'
            name={name}
            type='file'
            accept='.png, .jpg, .jpeg'
            multiple={multiple}
            onChange={handleFileChange}
            required={required}
            style={{ display: 'none' }}
          />
        </Button>
      </div>
    );
  }
);

// Wrapper component for react-final-form compatibility
const ImageUploadField = forwardRef(
  (
    {
      name,
      setImage,
      multiple = false,
      required = false,
      onFileChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className='mb-4 d-flex justify-content-center'>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Field name={name}>
            {({ input: { value, onChange } }) => (
              <ImageUpload
                {...props}
                name={name}
                value={value}
                onChange={onChange}
                setImage={setImage}
                multiple={multiple}
                required={required}
                onFileChange={onFileChange}
                ref={ref}
              />
            )}
          </Field>
        </div>
      </div>
    );
  }
);

export default ImageUpload;
export { ImageUploadField };
