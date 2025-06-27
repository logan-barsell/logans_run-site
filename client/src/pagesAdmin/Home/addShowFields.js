const ADD_SHOW_FIELDS = [
  {
    label: 'Upload Image',
    name: 'poster',
    type: 'image',
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

export default ADD_SHOW_FIELDS;
