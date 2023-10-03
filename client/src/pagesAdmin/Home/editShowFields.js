export default (show) => {
  const { poster, venue, location, date, doors, showtime, doorprice, advprice, tixlink } = show ? show : null;
  return [
    {
      label: 'Upload Image',
      name: 'poster',
      type: 'image',
      initialValue: poster
    },
    {
      label: 'Venue',
      name: 'venue',
      type: 'text',
      initialValue: venue
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      initialValue: location
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      initialValue: date
    },
    {
      label: 'Time',
      name: {
        doors: 'doors',
        showtime: 'showtime',
      },
      placeholder: {
        doors: 'Doors:',
        showtime: 'Show:'
      },
      type: 'time',
      initialValues: {
        doors,
        showtime
      }
    },
    {
      label: 'Price',
      name: {
        doorprice: 'doorprice',
        advprice: 'advprice'
      },
      placeholder: {
        doorprice: 'Door:',
        advprice: 'Adv:'
      },
      type: 'price',
      initialValues: {
        doorprice,
        advprice
      }
    },
    {
      label: 'Ticket Link',
      name: 'tixlink',
      type: 'text',
      initialValue: tixlink
    }
  ];
}