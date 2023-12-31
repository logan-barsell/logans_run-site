import './imageUpload.css';

import React from 'react';
import { Field } from 'react-final-form';
const required = value => (value ? undefined : 'Required');

const ImageUpload = ({ name, initialValue }) => {
  const isRequired = initialValue ? false : true;

  return (
    <div className="form-group">
      <Field name={name} validate={isRequired && required}>
        {({ input: { value, onChange, ...input } }) => (
          <>
            <span className="selectedFile">{value ? value[0]?.name : 'No File Selected'}</span>
            <div className="fileUpload btn btn-danger">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-camera-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                </svg> Upload Image
              </span>
              <input
                className="form-control upload"
                {...input}
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={({ target }) => onChange(target?.files)}
                required={isRequired}
              />
            </div>
          </>
        )}
      </Field>
    </div>
  )
};

export default ImageUpload;
