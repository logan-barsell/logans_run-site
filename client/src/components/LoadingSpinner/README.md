# LoadingSpinner Component

A reusable loading spinner component with multiple size and color variants.

## Usage

```jsx
import LoadingSpinner from '../LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With custom props
<LoadingSpinner
  size="lg"
  color="main"
  text="Loading products..."
  centered={true}
/>
```

## Props

| Prop        | Type                                          | Default  | Description                   |
| ----------- | --------------------------------------------- | -------- | ----------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'`                | `'md'`   | Size of the spinner           |
| `color`     | `'main' \| 'secondary' \| 'white' \| 'black'` | `'main'` | Color variant                 |
| `text`      | `string`                                      | `''`     | Optional text below spinner   |
| `centered`  | `boolean`                                     | `true`   | Whether to center the spinner |
| `className` | `string`                                      | `''`     | Additional CSS classes        |
| `style`     | `object`                                      | `{}`     | Additional inline styles      |

## Examples

```jsx
// Small spinner for buttons
<LoadingSpinner size="sm" color="white" centered={false} />

// Large spinner with text for page loading
<LoadingSpinner
  size="lg"
  color="main"
  text="Loading your data..."
  centered={true}
/>

// Custom styling
<LoadingSpinner
  size="xl"
  color="secondary"
  className="my-custom-class"
  style={{ marginTop: '2rem' }}
/>
```

## Accessibility

- Includes proper ARIA attributes
- Respects `prefers-reduced-motion` for users who prefer reduced animations
- Provides fallback for reduced motion users
