import React, { forwardRef } from 'react';
import {
  TextField,
  DateField,
  TimeField,
  PriceField,
  PriceFields,
  TextareaField,
  SelectField,
  RadioField,
} from './FieldTypes';
import { ImageUploadField } from './FieldTypes/ImageUpload';
import { VideoUploadField } from './FieldTypes/VideoUpload';
import ConditionalVideoUploadField from './FieldTypes/ConditionalVideoUpload';
import ConditionalImageUploadField from './FieldTypes/ConditionalImageUpload';
import ConditionalNumberField from './FieldTypes/ConditionalNumber';
import ConditionalTextField from './FieldTypes/ConditionalText';
import ConditionalYoutubeUrlField from './FieldTypes/ConditionalYoutubeUrl';
import OptionsField from './FieldTypes/OptionsField';
import NumberField from './FieldTypes/NumberField';
import ColorSelectorField from './FieldTypes/ColorSelectorField';
import FontSelectField from './FieldTypes/FontSelectField';
import SocialMediaIconStyleField from './FieldTypes/SocialMediaIconStyleField';
import {
  validateSpotifyUrl,
  validateSpotifySocialUrl,
  validateAppleMusicUrl,
  validateYouTubeUrl,
  validateSoundCloudUrl,
  validateFacebookUrl,
  validateInstagramUrl,
  validateTikTokUrl,
  validateYouTubeSocialUrl,
  validateXUrl,
  validateEmail,
  validatePhone,
  validateUrl,
} from '../../lib/validation';

// Forward ref for image fields
const RenderField = forwardRef(({ field, imageRef, onFileChange }, ref) => {
  const {
    name,
    label,
    options,
    placeholder,
    type,
    initialValue,
    initialValues,
    required,
  } = field;

  if (type === 'text') {
    return (
      <TextField
        label={label}
        name={name}
        placeholder={placeholder}
        initialValue={initialValue}
        helperText={field.helperText}
        displayHelperText={field.displayHelperText}
        required={required}
      />
    );
  } else if (type === 'password') {
    return (
      <TextField
        label={label}
        name={name}
        type='password'
        placeholder={placeholder}
        initialValue={initialValue}
        helperText={field.helperText}
        displayHelperText={field.displayHelperText}
        required={required}
      />
    );
  } else if (type === 'email') {
    return (
      <TextField
        label={label}
        name={name}
        placeholder={placeholder || 'Enter email address'}
        initialValue={initialValue}
        required={required}
        validate={value => {
          if (!value) return undefined;
          const validation = validateEmail(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Please enter a valid email address'
      />
    );
  } else if (type === 'phone') {
    return (
      <TextField
        label={label}
        name={name}
        placeholder={placeholder || 'Enter phone number'}
        initialValue={initialValue}
        validate={value => {
          if (!value) return undefined;
          const validation = validatePhone(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Please enter a valid 10-digit US phone number'
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
    // Check if this is a conditional field
    if (field.conditionField && field.conditionValue) {
      return (
        <ConditionalImageUploadField
          ref={imageRef}
          label={label}
          name={name}
          conditionField={field.conditionField}
          conditionValue={field.conditionValue}
          initialValue={initialValue}
          required={required}
          onFileChange={onFileChange}
        />
      );
    }

    return (
      <ImageUploadField
        ref={imageRef}
        label={label}
        name={name}
        initialValue={initialValue}
        required={required}
        onFileChange={onFileChange}
      />
    );
  } else if (type === 'radio') {
    return (
      <RadioField
        label={label}
        name={name}
        initialValue={initialValue}
        options={options}
        toggle={field.toggle}
        enabledText={field.enabledText}
        disabledText={field.disabledText}
        disabled={field.disabled}
        helperText={field.helperText}
      />
    );
  } else if (type === 'video') {
    return (
      <VideoUploadField
        ref={imageRef}
        label={label}
        name={name}
        initialValue={initialValue}
        required={required}
        onFileChange={onFileChange}
      />
    );
  } else if (type === 'conditionalVideo') {
    return (
      <ConditionalVideoUploadField
        ref={imageRef}
        label={label}
        name={name}
        initialValue={initialValue}
        required={required}
        onFileChange={onFileChange}
      />
    );
  } else if (type === 'conditionalImage') {
    return (
      <ConditionalImageUploadField
        ref={imageRef}
        label={label}
        name={name}
        conditionField={field.conditionField}
        conditionValue={field.conditionValue}
        initialValue={initialValue}
        required={required}
        onFileChange={onFileChange}
      />
    );
  } else if (type === 'conditionalNumber') {
    return (
      <ConditionalNumberField
        ref={imageRef}
        label={label}
        name={name}
        conditionField={field.conditionField}
        conditionValue={field.conditionValue}
        initialValue={initialValue}
        placeholder={placeholder}
      />
    );
  } else if (type === 'conditionalText') {
    return (
      <ConditionalTextField
        ref={imageRef}
        label={label}
        name={name}
        conditionField={field.conditionField}
        conditionValue={field.conditionValue}
        initialValue={initialValue}
        placeholder={placeholder}
        required={required}
      />
    );
  } else if (type === 'conditionalYoutubeUrl') {
    return (
      <ConditionalYoutubeUrlField
        ref={imageRef}
        label={label}
        name={name}
        conditions={field.conditions}
        initialValue={initialValue}
        placeholder={placeholder}
        required={required}
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
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter Spotify URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateSpotifyUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Track, Album, or Playlist URLs from Spotify (e.g., open.spotify.com/...)'
      />
    );
  } else if (type === 'spotifySocialUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter Spotify URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateSpotifySocialUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Any valid Spotify URL (profile, track, album, playlist, etc.)'
      />
    );
  } else if (type === 'appleMusicUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter Apple Music URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateAppleMusicUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Album, Song, Playlist, or Artist URLs from Apple Music (e.g., music.apple.com/...)'
      />
    );
  } else if (type === 'youtubeUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter YouTube URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateYouTubeUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Video, Playlist, or Channel URLs from YouTube (e.g., youtube.com/watch?v=... or youtu.be/...)'
      />
    );
  } else if (type === 'soundcloudUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter SoundCloud URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateSoundCloudUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Track, Playlist, or Artist URLs from SoundCloud (e.g., soundcloud.com/...)'
      />
    );
  } else if (type === 'facebookUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter Facebook URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateFacebookUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Facebook page or profile URLs'
      />
    );
  } else if (type === 'instagramUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter Instagram URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateInstagramUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: Instagram profile URLs'
      />
    );
  } else if (type === 'tiktokUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter TikTok URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateTikTokUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: TikTok profile URLs'
      />
    );
  } else if (type === 'youtubeSocialUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter YouTube URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateYouTubeSocialUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: YouTube channel or user URLs'
      />
    );
  } else if (type === 'xUrl') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter X (Twitter) URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateXUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Supported formats: X (Twitter) profile URLs'
      />
    );
  } else if (type === 'url') {
    return (
      <TextField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder || 'Enter URL'}
        validate={value => {
          if (!value) return undefined;
          const validation = validateUrl(value);
          return validation.isValid ? undefined : validation.error;
        }}
        helperText='Enter a valid URL (e.g., example.com or https://example.com)'
      />
    );
  } else if (type === 'select') {
    return (
      <OptionsField
        label={label}
        name={name}
        options={options}
        initialValue={initialValue}
        required={required}
      />
    );
  } else if (type === 'textarea') {
    return (
      <TextareaField
        label={label}
        name={name}
        initialValue={initialValue}
        placeholder={placeholder}
        rows={field.rows || 3}
        required={required}
        helperText={field.helperText}
      />
    );
  } else if (type === 'dropdown') {
    return (
      <SelectField
        label={label}
        name={name}
        options={options}
        initialValue={initialValue}
        placeholder={placeholder}
        required={required}
        helperText={field.helperText}
      />
    );
  } else if (type === 'color') {
    return (
      <ColorSelectorField
        label={label}
        name={name}
        type={field.colorType || 'primary'}
        initialValue={initialValue}
        required={required}
        helperText={field.helperText}
      />
    );
  } else if (type === 'font') {
    return (
      <FontSelectField
        label={label}
        name={name}
        optgroups={field.optgroups || []}
        initialValue={initialValue}
        placeholder={placeholder}
        required={required}
        helperText={field.helperText}
      />
    );
  } else if (type === 'socialMediaIconStyle') {
    return (
      <SocialMediaIconStyleField
        label={label}
        name={name}
        options={options}
        initialValue={initialValue}
        placeholder={placeholder}
        required={required}
        helperText={field.helperText}
      />
    );
  } else if (type === 'divider') {
    return <hr className='my-4 border-secondary opacity-50' />;
  }
  return null;
});

export default RenderField;
