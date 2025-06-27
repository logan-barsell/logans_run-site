import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchProducts } from '../../redux/actions';
import { addProductToCart } from '../../redux/cartRedux';
import { useDispatch } from 'react-redux';

const Products = ({ fetchProducts, products }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = item => {
    dispatch(addProductToCart(item));
  };

  const renderProducts = products.length
    ? () =>
        products.map((item, index) => {
          const { product, price } = item;
          const imageUrl =
            product.images && product.images.length > 0
              ? product.images[0]
              : '';

          return (
            <div
              key={index}
              className='col-lg-4 col-md-6'
            >
              <div className='card product'>
                <img
                  className='card-img-top'
                  src={imageUrl}
                  alt='product'
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />

                <div className='card-body'>
                  <h5 className='card-title product-name'>{product.name}</h5>

                  <div className='price secondary-font'>
                    $<span>{price.unit_amount / 100}</span>
                  </div>
                  <div className='d-grid gap-2'>
                    <button
                      onClick={() => addToCart(item)}
                      className='btn btn-sm btn-danger'
                      data-bs-toggle='offcanvas'
                      data-bs-target='#shoppingCart'
                      aria-controls='shoppingCart'
                    >
                      Add to Cart{' '}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        fill='currentColor'
                        className='bi bi-plus-square-fill'
                        viewBox='0 0 16 16'
                      >
                        <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
                      </svg>
                    </button>
                    {/* } */}
                  </div>
                </div>
              </div>
            </div>
          );
        })
    : () => (
        <h3
          id='no_content'
          className='no-content'
        >
          No merch yet... check back soon!
        </h3>
      );

  return <>{renderProducts()}</>;
};

function mapStateToProps({ products }) {
  return { products };
}

export default connect(mapStateToProps, { fetchProducts })(Products);
