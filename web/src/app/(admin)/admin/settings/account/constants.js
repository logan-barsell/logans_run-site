// Account form field configuration
export const ACCOUNT_FIELDS = [
  {
    name: 'adminEmail',
    type: 'email',
    label: 'Admin Email',
    required: true,
    placeholder: 'Enter your admin email address',
    helperText:
      'This email will be used for account notifications and password resets',
  },
  {
    name: 'adminPhone',
    type: 'phone',
    label: 'Admin Phone',
    required: false,
    placeholder: 'Enter your phone number (optional)',
    helperText: 'Optional phone number for account security and notifications',
  },
];
