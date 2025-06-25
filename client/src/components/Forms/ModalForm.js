import './modalForm.css';

import React from 'react';
import { Form } from 'react-final-form';

import RenderField from './RenderField';

const ModalForm = ({ onSubmit, fields }) => {
  const renderFields = () => {
    return fields.map((field, index) => {
      return (
        <RenderField
          key={index}
          field={field}
        />
      );
    });
  };

  const onFormRestart = form => {
    form.restart();
    const uploaded = document.querySelector('.upload');
    if (uploaded) {
      uploaded.value = null;
    }
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
                    Object.keys(form.getState().errors).length === 0
                      ? false
                      : true
                  }
                  data-bs-dismiss='modal'
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
