import './merchEdit.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  fetchProducts,
  updateProduct,
  removeProduct,
} from '../../redux/actions';
import Accordion from '../../components/Bootstrap/Accordion';
import editProductFields from './editProductFields';
import AddProduct from './AddProduct';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../firebase';

const MerchEdit = ({
  fetchProducts,
  updateProduct,
  removeProduct,
  products,
}) => {
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async id => {
    // Find the product to get its image URL
    const productToDelete = products.find(item => item.product.id === id);
    const imageUrl =
      productToDelete &&
      productToDelete.product.images &&
      productToDelete.product.images[0];
    if (imageUrl) {
      await removeProduct(`${id}?imageUrl=${encodeURIComponent(imageUrl)}`);
    } else {
      await removeProduct(id);
    }
    fetchProducts();
  };

  const editFields = product => {
    return editProductFields(product);
  };

  const editProductHandler = async (id, updatedFields) => {
    let images = updatedFields.images;
    // Find the current product to get the old image URL
    const currentProduct = products.find(item => item.product.id === id);
    let oldImageUrl = '';
    if (
      currentProduct &&
      currentProduct.product.images &&
      currentProduct.product.images[0]
    ) {
      oldImageUrl = currentProduct.product.images[0];
    }
    // If a new image file is provided, upload to Firebase
    if (images && images.length && images[0] instanceof File) {
      const file = images[0];
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          error => reject(error),
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            images = [imageUrl];
            resolve();
          }
        );
      });
    } else if (images && typeof images[0] === 'string') {
      images = [images[0]];
    }
    const payload = {
      ...updatedFields,
      images,
      price: Math.round(Number(updatedFields.price) * 100),
      oldImageUrl,
    };
    await updateProduct(id, payload);
    fetchProducts();
  };

  // Always sort products by creation date (oldest first) for consistent order
  const sortedProducts = [...products].sort(
    (a, b) => a.product.created - b.product.created
  );

  const accordionItems = sortedProducts.map(item => {
    const { product, price } = item;
    return {
      data: { _id: product.id, ...item },
      group: 'products',
      id: product.id,
      name: product.name,
      header: product.name,
      img: product.images && product.images.length ? product.images[0] : '',
      subhead: product.name,
      content: [
        {
          prefix: 'Price: ',
          value: `$${(price.unit_amount / 100).toFixed(2)}`,
        },
        {
          prefix: 'Sizes: ',
          value:
            product.metadata && product.metadata.sizes
              ? product.metadata.sizes
              : 'N/A',
        },
      ],
    };
  });

  return (
    <div
      id='merchEdit'
      className='container'
    >
      <h3>Edit Products</h3>
      <hr />
      {products.length > 0 ? (
        <Accordion
          id='productsList'
          title='Products'
          items={accordionItems}
          editFields={editFields}
          onEdit={editProductHandler}
          onDelete={deleteProduct}
        />
      ) : (
        <h3 className='no-content'>No Products</h3>
      )}
      <AddProduct />
    </div>
  );
};

function mapStateToProps({ products }) {
  return { products };
}

export default connect(mapStateToProps, {
  fetchProducts,
  updateProduct,
  removeProduct,
})(MerchEdit);
