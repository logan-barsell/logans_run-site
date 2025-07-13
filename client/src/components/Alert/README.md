# Alert System

A flexible, global alert system for displaying notifications to users throughout the application.

## Features

- ✅ **Multiple Alert Types**: Error, Success, Warning, Info
- ✅ **Flexible Positioning**: 6 different positions (top-left, top-right, bottom-left, bottom-right, top-center, bottom-center)
- ✅ **Auto-dismiss**: Configurable duration with default 3 seconds
- ✅ **Manual Dismiss**: Users can close alerts manually
- ✅ **Stacking**: Up to 3 alerts at once (configurable)
- ✅ **Slide In, Fade Out**: Smooth slide-in and fade-out transitions
- ✅ **Theme Integration**: Uses secondary theme font
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Global Access**: Available throughout the entire app

## Quick Start

### 1. Basic Usage

```jsx
import { useAlert } from '../contexts/AlertContext';

const MyComponent = () => {
  const { showError, showSuccess, showWarning, showInfo } = useAlert();

  const handleAction = () => {
    try {
      // Your logic here
      showSuccess('Operation completed successfully!');
    } catch (error) {
      showError('Something went wrong!');
    }
  };

  return <button onClick={handleAction}>Perform Action</button>;
};
```

### 2. Service Integration

```jsx
import { useAlert } from '../contexts/AlertContext';
import { handleServiceError } from '../utils/errorHandler';

const MyComponent = () => {
  const { showError, showSuccess } = useAlert();

  const handleApiCall = async () => {
    try {
      const response = await api.get('/some-endpoint');
      showSuccess('Data loaded successfully!');
      return response.data;
    } catch (error) {
      const { message } = handleServiceError(error, 'Custom error message');
      showError(message);
    }
  };
};
```

## API Reference

### Alert Context Hook

```jsx
const {
  showError,
  showSuccess,
  showWarning,
  showInfo,
  addAlert,
  removeAlert,
  clearAlerts,
  setPosition,
  alerts,
  position,
  maxAlerts,
} = useAlert();
```

### Alert Methods

#### `showError(message, duration = 5000)`

Display an error alert (red).

#### `showSuccess(message, duration = 3000)`

Display a success alert (green).

#### `showWarning(message, duration = 4000)`

Display a warning alert (yellow).

#### `showInfo(message, duration = 3000)`

Display an info alert (blue).

#### `addAlert({ type, message, duration, position })`

Add a custom alert with full configuration.

#### `removeAlert(id)`

Remove a specific alert by ID.

#### `clearAlerts()`

Remove all active alerts.

#### `setPosition(position)`

Change the position of all alerts.

### Alert Types

```jsx
import { ALERT_TYPES } from '../contexts/AlertContext';

ALERT_TYPES.ERROR; // 'error'
ALERT_TYPES.SUCCESS; // 'success'
ALERT_TYPES.WARNING; // 'warning'
ALERT_TYPES.INFO; // 'info'
```

### Alert Positions

```jsx
import { ALERT_POSITIONS } from '../contexts/AlertContext';

ALERT_POSITIONS.TOP_LEFT; // 'top-left'
ALERT_POSITIONS.TOP_RIGHT; // 'top-right'
ALERT_POSITIONS.BOTTOM_LEFT; // 'bottom-left'
ALERT_POSITIONS.BOTTOM_RIGHT; // 'bottom-right'
ALERT_POSITIONS.TOP_CENTER; // 'top-center'
ALERT_POSITIONS.BOTTOM_CENTER; // 'bottom-center'
```

## Error Handling Utility

### `handleServiceError(error, customMessage, showAlert)`

Automatically extracts meaningful error messages from API responses.

```jsx
import { handleServiceError } from '../utils/errorHandler';

try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  const {
    message,
    error: originalError,
    showAlert,
  } = handleServiceError(error, 'Custom fallback message', true);

  if (showAlert) {
    showError(message);
  }
}
```

### Supported Error Types

- **HTTP Status Codes**: 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504
- **Network Errors**: Connection timeouts, network failures
- **API Response Errors**: Server-provided error messages
- **Generic Errors**: Fallback messages for unknown errors

## Styling

### CSS Variables

The alert system uses these CSS variables for theming:

```css
--secondary-font: 'Courier New', Courier, monospace; /* From theme */
```

### Custom Styling

You can customize alert appearance by overriding CSS classes:

```css
.alert-item--error .alert {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.alert-item--success .alert {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}
```

## Examples

### 1. Form Submission

```jsx
const handleSubmit = async formData => {
  try {
    await submitForm(formData);
    showSuccess('Form submitted successfully!');
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to submit form');
    showError(message);
  }
};
```

### 2. Data Loading

```jsx
const loadData = async () => {
  try {
    const data = await fetchData();
    setData(data);
    showSuccess('Data loaded successfully!');
  } catch (error) {
    const { message } = handleServiceError(error);
    showError(message);
  }
};
```

### 3. File Upload

```jsx
const handleFileUpload = async file => {
  try {
    await uploadFile(file);
    showSuccess('File uploaded successfully!');
  } catch (error) {
    const { message } = handleServiceError(error, 'Failed to upload file');
    showError(message);
  }
};
```

### 4. Dynamic Positioning

```jsx
const { setPosition } = useAlert();

const moveAlertsToTop = () => {
  setPosition(ALERT_POSITIONS.TOP_CENTER);
  showInfo('Alerts moved to top center!');
};
```

## Testing

Use the `AlertTest` component to test all alert functionality:

```jsx
import { AlertTest } from '../components/Alert';

// Add to any page for testing
<AlertTest />;
```

## Best Practices

1. **Use Descriptive Messages**: Provide clear, actionable error messages
2. **Consistent Duration**: Use appropriate durations for different alert types
3. **Error Logging**: Always log errors in development for debugging
4. **User-Friendly Messages**: Avoid technical jargon in user-facing alerts
5. **Fallback Messages**: Always provide fallback messages for unknown errors

## Migration Guide

### From Old Error Handling

**Before:**

```jsx
try {
  await apiCall();
} catch (error) {
  console.error(error);
  // No user feedback
}
```

**After:**

```jsx
import { useAlert } from '../contexts/AlertContext';

const { showError } = useAlert();

try {
  await apiCall();
} catch (error) {
  const { message } = handleServiceError(error);
  showError(message);
}
```
