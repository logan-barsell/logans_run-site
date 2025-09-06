import './videoUpload.css';

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Field } from 'react-final-form';
import { CameraReelsFill } from '../../icons';
import Button from '../../Button/Button';

const VideoUpload = forwardRef(
  (
    { name, setVideo, onChange, value, required = false, onFileChange },
    ref
  ) => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const inputRef = useRef();

    // Expose clear() to parent
    useImperativeHandle(ref, () => ({
      clear: () => {
        setSelectedFiles(null);
        if (inputRef.current) inputRef.current.value = null;
        if (setVideo) setVideo(null);
        if (onChange) onChange({ target: { name, value: null } });
        if (onFileChange) onFileChange(name, null);
      },
    }));

    // Handle value prop for react-final-form compatibility
    useEffect(() => {
      if (value && (value instanceof FileList || value instanceof File)) {
        setSelectedFiles(value);
      } else if (!value) {
        setSelectedFiles(null);
      }
    }, [value]);

    const renderSelectedFiles = files => {
      if (!files || files.length === 0) return 'No Video Selected';

      return files[0]?.name || 'No Video Selected';
    };

    const handleFileChange = ({ target }) => {
      const files = target?.files;

      // Validate file type
      if (files && files[0]) {
        const file = files[0];
        const allowedTypes = [
          'video/mp4',
          'video/webm',
          'video/quicktime',
          'video/x-msvideo',
        ];
        const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi'];

        const fileExtension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf('.'));
        const isValidType =
          allowedTypes.includes(file.type) ||
          allowedExtensions.includes(fileExtension);

        if (!isValidType) {
          alert('Please select a valid video file (MP4, WebM, MOV, or AVI)');
          return;
        }

        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024; // 100MB in bytes
        if (file.size > maxSize) {
          alert('Video file size must be less than 100MB');
          return;
        }
      }

      setSelectedFiles(files);

      // Always call setVideo if provided (for backward compatibility)
      if (setVideo) {
        setVideo(files[0]);
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
          icon={<CameraReelsFill />}
          iconPosition='left'
          as='label'
        >
          Upload Video
          <input
            ref={inputRef}
            className='form-control upload'
            name={name}
            type='file'
            accept='.mp4,.webm,.mov,.avi,video/mp4,video/webm,video/quicktime,video/x-msvideo'
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
const VideoUploadField = forwardRef(
  ({ name, setVideo, required = false, onFileChange, ...props }, ref) => {
    return (
      <Field name={name}>
        {({ input: { value, onChange, ...input } }) => (
          <VideoUpload
            {...props}
            name={name}
            value={value}
            onChange={onChange}
            setVideo={setVideo}
            required={required}
            onFileChange={onFileChange}
            ref={ref}
          />
        )}
      </Field>
    );
  }
);

export default VideoUpload;
export { VideoUploadField };
