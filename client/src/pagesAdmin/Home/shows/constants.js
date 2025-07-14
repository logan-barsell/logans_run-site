export const editShowFields = show => {
  const {
    poster,
    venue,
    location,
    date,
    doors,
    showtime,
    doorprice,
    advprice,
    tixlink,
  } = show ? show : null;
  return [
    {
      label: 'Upload Image',
      name: 'poster',
      type: 'image',
      initialValue: poster,
      required: false,
    },
    {
      label: 'Venue',
      name: 'venue',
      type: 'text',
      initialValue: venue,
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      initialValue: location,
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      initialValue: date,
    },
    {
      label: 'Time',
      name: {
        doors: 'doors',
        showtime: 'showtime',
      },
      placeholder: {
        doors: 'Doors:',
        showtime: 'Show:',
      },
      type: 'time',
      initialValues: {
        doors,
        showtime,
      },
    },
    {
      label: 'Price',
      name: {
        doorprice: 'doorprice',
        advprice: 'advprice',
      },
      placeholder: {
        doorprice: 'Door:',
        advprice: 'Adv:',
      },
      type: 'prices',
      initialValues: {
        doorprice,
        advprice,
      },
    },
    {
      label: 'Ticket Link',
      name: 'tixlink',
      type: 'text',
      initialValue: tixlink,
    },
  ];
};

export const SHOW_SYSTEM_OPTIONS = [
  { value: 'custom', label: 'Custom Management' },
  { value: 'bandsintown', label: 'Bandsintown' },
];

export const DEFAULT_SHOW_SETTINGS = {
  showSystem: 'custom',
  bandsintownArtist: '',
};

export const ADD_SHOW_FIELDS = [
  {
    label: 'Upload Image',
    name: 'poster',
    type: 'image',
    required: true,
  },
  {
    label: 'Venue',
    name: 'venue',
    type: 'text',
  },
  {
    label: 'Location',
    name: 'location',
    type: 'text',
  },
  {
    label: 'Date',
    name: 'date',
    type: 'date',
  },
  {
    label: 'Time',
    name: {
      doors: 'doors',
      showtime: 'showtime',
    },
    placeholder: {
      doors: 'Doors:',
      showtime: 'Show:',
    },
    type: 'time',
  },
  {
    label: 'Price',
    name: {
      doorprice: 'doorprice',
      advprice: 'advprice',
    },
    placeholder: {
      doorprice: 'Door:',
      advprice: 'Adv:',
    },
    type: 'prices',
  },
  {
    label: 'Ticket Link',
    name: 'tixlink',
    type: 'text',
  },
];
