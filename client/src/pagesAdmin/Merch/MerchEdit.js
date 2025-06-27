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
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

function extractStoragePathFromUrl(url) {
  if (!url) {
    return '';
  }

  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // If it's already a storage path (not a full URL), return as is
  if (url && !url.startsWith('http')) {
    return url;
  }

  // Fallback - extract filename from URL
  return url.split('/').pop().split('?')[0];
}

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
    const productToDelete = products.find(item => item.product.id === id);

    const imageUrl =
      productToDelete &&
      productToDelete.product.images &&
      productToDelete.product.images[0];

    const imageName = extractStoragePathFromUrl(imageUrl);

    if (imageName) {
      try {
        await deleteImageFromFirebase(imageName);
      } catch (error) {
        // Continue with product deletion even if image deletion fails
        // This is common if the image was already deleted or doesn't exist
      }
    }

    try {
      await removeProduct(id);
      fetchProducts();
    } catch (error) {
      throw error;
    }
  };

  const editFields = product => {
    return editProductFields(product);
  };

  const editProductHandler = async (id, updatedFields) => {
    let images = updatedFields.images;
    const currentProduct = products.find(item => item.product.id === id);
    let oldImageUrl = '';
    if (
      currentProduct &&
      currentProduct.product.images &&
      currentProduct.product.images[0]
    ) {
      oldImageUrl = currentProduct.product.images[0];
    }
    if (images && images.length && images[0] instanceof File) {
      const oldImageName = extractStoragePathFromUrl(oldImageUrl);
      if (oldImageName) {
        await deleteImageFromFirebase(oldImageName);
      }
      try {
        images = [await uploadImageToFirebase(images[0])];
      } catch (err) {
        throw err;
      }
    } else if (images && typeof images[0] === 'string') {
      images = [images[0]];
    }
    const payload = {
      ...updatedFields,
      images,
      price: Math.round(Number(updatedFields.price) * 100),
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
