// Field definitions for Account Settings form

export const ACCOUNT_FIELDS = [
  {
    name: 'adminEmail',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email address',
    required: true,
    helperText:
      'This is your primary email for authentication, account management, and notifications.',
  },
  {
    name: 'adminPhone',
    type: 'phone',
    label: 'Phone',
    placeholder: 'Enter your phone number',
    required: false,
    helperText: 'Optional phone number for account management and support.',
  },
];
