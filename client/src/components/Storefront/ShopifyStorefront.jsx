import React, { useEffect, useState } from 'react';
import './Storefront.css';
import {
  fetchShopifyProducts,
  createShopifyCheckout,
} from '../../services/shopifyService';
import { useAlert } from '../../contexts/AlertContext';
import normalizeUrl from '../../utils/normalizeUrl';

const ShopifyStorefront = ({
  shopDomain,
  storefrontAccessToken,
  collectionId,
}) => {
  const { showError } = useAlert();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await fetchShopifyProducts(
          shopDomain,
          storefrontAccessToken,
          collectionId
        );
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        showError(err.message);
      }
    };

    if (shopDomain && storefrontAccessToken && collectionId) {
      fetchProducts();
    }
  }, [shopDomain, storefrontAccessToken, collectionId, showError]);

  const handleCheckout = async variantId => {
    try {
      const checkoutUrl = await createShopifyCheckout(
        shopDomain,
        storefrontAccessToken,
        variantId
      );
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Error creating checkout:', err);
      showError(err.message || 'Error creating checkout. Please try again.');
    }
  };

  if (products.length === 0) {
    return (
      <div className='no-products'>
        <h3 className='no-content'>No products available</h3>
        <p>Check back soon for new merchandise!</p>
      </div>
    );
  }

  return (
    <div className='shopify-storefront'>
      <div className='p-4'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-8'>
            <div className='text-center mb-4 d-flex flex-column align-items-center'>
              <p className='store-subtitle secondary-font'>
                Browse and purchase our merchandise securely through Shopify
              </p>
              <a
                href={normalizeUrl(shopDomain)}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-sm btn-outline-light'
              >
                Visit Store
              </a>
              <hr className='w-100' />
            </div>

            <div className='products-grid'>
              {products.map(product => (
                <div
                  key={product.id}
                  className='product-item'
                >
                  <div className='card product'>
                    <img
                      className='card-img-top'
                      src={product.imageUrl}
                      alt={product.altText}
                      onError={e => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className='card-body'>
                      <h5 className='card-title product-name'>
                        {product.title}
                      </h5>
                      {product.description && (
                        <p className='card-text product-description'>
                          {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                        </p>
                      )}
                      <div className='price secondary-font'>
                        {product.currencyCode === 'USD'
                          ? '$'
                          : product.currencyCode}
                        <span>{parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <div className='d-grid gap-2'>
                        <button
                          onClick={() => handleCheckout(product.variantId)}
                          className='btn btn-sm btn-danger'
                          disabled={!product.variantId}
                        >
                          Buy on Shopify
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            fill='currentColor'
                            className='bi bi-cart-plus ms-2'
                            viewBox='0 0 16 16'
                          >
                            <path d='M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z' />
                            <path d='M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4H7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyStorefront;
