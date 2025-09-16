import React, { useState } from 'react';
import { Field } from 'react-final-form';
import {
  getPreselectedColors,
  getColorName,
  getColorPalette,
} from '../../../lib/colors';

const ColorSelectorField = ({
  name,
  label,
  type = 'primary',
  required = false,
  helperText,
  ...props
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <Field
      name={name}
      {...props}
    >
      {({ input, meta }) => {
        const preselectedColors = getPreselectedColors(type);
        const currentColorName = getColorName(type, input.value);
        const isCustomColor = !preselectedColors.find(
          color => color.value === input.value
        );

        const handleColorSelect = colorValue => {
          input.onChange(colorValue);
        };

        const handleColorPickerChange = e => {
          input.onChange(e.target.value);
        };

        // Helper function to get the display color for swatches
        const getDisplayColor = colorValue => {
          if (type === 'background') {
            // For background colors, use the theme's primary color for the swatch
            const palette = getColorPalette(colorValue);
            return palette.primary;
          }
          return colorValue;
        };

        return (
          <div className='mb-sm-3 mb-2'>
            <div className='d-flex align-items-center gap-3 mb-2'>
              <label
                className='form-label mb-0'
                style={{ minWidth: '120px' }}
              >
                {label}
              </label>
            </div>

            {/* Visual Color Swatches */}
            <div
              className='d-flex flex-wrap gap-2 mb-2'
              style={{ justifyContent: 'flex-start' }}
            >
              {preselectedColors.map(color => (
                <div
                  key={color.value}
                  className={`color-swatch ${
                    input.value === color.value ? 'selected' : ''
                  }`}
                  onClick={() => handleColorSelect(color.value)}
                  style={{
                    width: 'clamp(32px, 4vw, 40px)',
                    height: 'clamp(32px, 4vw, 40px)',
                    borderRadius: '8px',
                    backgroundColor: getDisplayColor(color.value),
                    border:
                      input.value === color.value
                        ? '3px solid white'
                        : '2px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  title={color.name}
                >
                  {input.value === color.value && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              ))}

              {/* Custom Color Swatch - Only show for non-background colors */}
              {type !== 'background' && (
                <>
                  <div
                    className={`color-swatch ${
                      isCustomColor ? 'selected' : ''
                    }`}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{
                      width: 'clamp(32px, 4vw, 40px)',
                      height: 'clamp(32px, 4vw, 40px)',
                      borderRadius: '8px',
                      backgroundColor: isCustomColor
                        ? getDisplayColor(input.value)
                        : 'transparent',
                      border: isCustomColor
                        ? '3px solid white'
                        : '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      flexShrink: 0,
                      backgroundImage: isCustomColor
                        ? 'none'
                        : 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                    }}
                    title='Custom Color'
                  >
                    {isCustomColor && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Hidden Color Picker */}
                  <input
                    type='color'
                    className='form-control form-control-color'
                    name={name}
                    value={input.value}
                    onChange={handleColorPickerChange}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      pointerEvents: 'none',
                      width: '1px',
                      height: '1px',
                    }}
                    ref={inputRef => {
                      if (inputRef && showColorPicker) {
                        inputRef.click();
                        setShowColorPicker(false);
                      }
                    }}
                  />
                </>
              )}
            </div>

            {/* Color Info */}
            <div className='d-flex align-items-center gap-2'>
              <span
                className='secondary-font'
                style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}
              >
                Selected: {currentColorName}
              </span>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: getDisplayColor(input.value),
                  border: '1px solid white',
                  borderRadius: '4px',
                }}
              />
            </div>

            {/* Helper Text */}
            {helperText && (
              <div className='form-text text-muted mt-1'>{helperText}</div>
            )}

            {/* Error Message */}
            {meta.error && meta.touched && (
              <div
                className='text-danger mt-1'
                style={{ fontSize: '14px' }}
              >
                {meta.error}
              </div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default ColorSelectorField;
