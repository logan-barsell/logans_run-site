// client/src/utils/cssColors.js

function hexToRgb(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c
      .split('')
      .map(ch => ch + ch)
      .join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return { r, g, b };
}

function toRgbString(color) {
  if (!color) return '';
  const val = color.trim();
  if (val.startsWith('rgb(')) {
    // rgb(r, g, b)
    return val.replace(/rgb\(([^)]+)\)/, '$1').trim();
  }
  if (val.startsWith('rgba(')) {
    // rgba(r, g, b, a) -> strip alpha
    const parts = val
      .replace(/rgba\(([^)]+)\)/, '$1')
      .split(',')
      .map(s => s.trim());
    return parts.slice(0, 3).join(', ');
  }
  if (val.startsWith('#')) {
    const { r, g, b } = hexToRgb(val);
    return `${r}, ${g}, ${b}`;
  }
  // Fallback: let browser compute via a temporary element
  try {
    const el = document.createElement('div');
    el.style.color = val;
    document.body.appendChild(el);
    const cs = getComputedStyle(el).color; // rgb(r, g, b)
    document.body.removeChild(el);
    return cs.replace(/rgb\(([^)]+)\)/, '$1').trim();
  } catch {
    return '';
  }
}

module.exports = { toRgbString };
