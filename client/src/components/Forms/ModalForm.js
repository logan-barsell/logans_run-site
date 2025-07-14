import './modalForm.css';

import React, { useRef, useState, useCallback } from 'react';
import { Form } from 'react-final-form';

import RenderField from './RenderField';

const ModalForm = ({ onSubmit, fields }) => {
  // Create refs for all image fields
  const imageRefs = useRef({});
  fields.forEach(field => {
    if (field.type === 'image' && !imageRefs.current[field.name]) {
      imageRefs.current[field.name] = React.createRef();
    }
  });

  // State to track file values for all image fields
  const [imageValues, setImageValues] = useState({});

  // Callback to update imageValues when a file is selected/cleared
  const handleFileChange = useCallback((name, files) => {
    setImageValues(prev => ({ ...prev, [name]: files }));
  }, []);

  // Helper to check if all required image fields have a value
  const imageRequired = fields
    .filter(field => field.type === 'image' && field.required)
    .some(field => {
      const files = imageValues[field.name];
      return !files || files.length === 0;
    });

  const renderFields = () => {
    return fields.map((field, index) => {
      return (
        <RenderField
          key={index}
          field={field}
          imageRef={
            field.type === 'image' ? imageRefs.current[field.name] : undefined
          }
          onFileChange={field.type === 'image' ? handleFileChange : undefined}
        />
      );
    });
  };

  const onFormRestart = form => {
    form.restart();
    // Clear all image upload fields via refs
    Object.values(imageRefs.current).forEach(ref => {
      if (ref && ref.current && typeof ref.current.clear === 'function') {
        ref.current.clear();
      }
    });
    setImageValues({});
  };

  return (
    <div className='col-lg final-form'>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, meta }) => (
          <form
            onSubmit={async event => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              onFormRestart(form);
            }}
          >
            <div className='modal-body mx-auto mx-sm-4 my-3'>
              {renderFields()}
            </div>
            <div className='modal-footer'>
              <div className='d-grid col-auto'>
                <button
                  onClick={() => {
                    onFormRestart(form);
                  }}
                  type='button'
                  className='btn btn-dark'
                  data-bs-dismiss='modal'
                >
                  Cancel
                </button>
              </div>
              <div className='d-grid col-6'>
                <button
                  disabled={
                    Object.keys(form.getState().errors).length !== 0 ||
                    imageRequired
                  }
                  className='submitForm btn btn-danger'
                  type='submit'
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default ModalForm;
