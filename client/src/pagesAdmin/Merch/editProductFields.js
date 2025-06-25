const editProductFields = product => {
  const { product: prod = {}, price = {} } = product || {};
  return [
    {
      label: 'Upload Image',
      name: 'images',
      type: 'image',
      initialValue: prod.images && prod.images.length ? prod.images[0] : '',
    },
    {
      label: 'Product Name',
      name: 'name',
      type: 'text',
      initialValue: prod.name || '',
    },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      initialValue: prod.description || '',
    },
    {
      label: 'Sizes',
      name: 'sizes',
      type: 'text',
      initialValue:
        prod.metadata && prod.metadata.sizes ? prod.metadata.sizes : '',
    },
    {
      label: 'Price',
      name: 'price',
      type: 'price',
      initialValue: price.unit_amount ? price.unit_amount / 100 : '',
    },
  ];
};

export default editProductFields;
