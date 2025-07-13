import React, { Component } from 'react';
import {
  TextField,
  DateField,
  TimeField,
  PriceField,
  PriceFields,
  SpotifyUrlField,
} from './FieldTypes';
import { ImageUploadField } from './FieldTypes/ImageUpload';
import OptionsField from './FieldTypes/OptionsField';
import NumberField from './FieldTypes/NumberField';

class RenderField extends Component {
  renderContent() {
    const {
      name,
      label,
      options,
      placeholder,
      type,
      initialValue,
      initialValues,
    } = this.props.field;

    if (type === 'text') {
      return (
        <TextField
          label={label}
          name={name}
          placeholder={placeholder}
          initialValue={initialValue}
        />
      );
    } else if (type === 'date') {
      return (
        <DateField
          label={label}
          name={name}
          initialValue={initialValue}
        />
      );
    } else if (type === 'time') {
      return (
        <TimeField
          label={label}
          name={name}
          placeholder={placeholder}
          initialValues={initialValues}
        />
      );
    } else if (type === 'image') {
      return (
        <ImageUploadField
          label={label}
          name={name}
          initialValue={initialValue}
        />
      );
    } else if (type === 'price') {
      return (
        <PriceField
          label={label}
          name={name}
          placeholder={placeholder}
          initialValue={initialValue}
        />
      );
    } else if (type === 'prices') {
      return (
        <PriceFields
          label={label}
          name={name}
          placeholder={placeholder}
          initialValues={initialValues}
        />
      );
    } else if (type === 'options') {
      return (
        <OptionsField
          label={label}
          name={name}
          options={options}
          initialValue={initialValue}
        />
      );
    } else if (type === 'number') {
      return (
        <NumberField
          label={label}
          name={name}
          initialValue={initialValue}
          placeholder={placeholder}
        />
      );
    } else if (type === 'spotifyUrl') {
      return (
        <SpotifyUrlField
          label={label}
          name={name}
          initialValue={initialValue}
          placeholder={placeholder}
        />
      );
    }
  }

  render() {
    return <>{this.renderContent()}</>;
  }
}

export default RenderField;
