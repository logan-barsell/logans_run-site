import React, { useEffect, useState } from 'react';
import './Storefront.css';
import {
  fetchShopifyProducts,
  createShopifyCheckout,
} from '../../services/shopifyService';
import { useAlert } from '../../contexts/AlertContext';
import normalizeUrl from '../../utils/normalizeUrl';
import { CartPlus, Ticket } from '../icons';
import Button from '../Button/Button';
import { NoContent } from '../Header';
import LoadingSpinner from '../LoadingSpinner';

const ShopifyStorefront = ({
  shopDomain,
  storefrontAccessToken,
  collectionId,
}) => {
  const { showError } = useAlert();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopDomain || !storefrontAccessToken || !collectionId) {
        return;
      }

      try {
        setLoading(true);
        const productList = await fetchShopifyProducts(
          shopDomain,
          storefrontAccessToken,
          collectionId
        );
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  // Show loading state while fetching products
  if (loading) {
    return (
      <LoadingSpinner
        size='lg'
        color='white'
        text='Loading products...'
        centered={true}
      />
    );
  }

  // Show no products only after loading is complete and no products
  if (products.length === 0) {
    return (
      <div className='no-products'>
        <NoContent>No products available</NoContent>
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
              <Button
                as='a'
                href={normalizeUrl(shopDomain)}
                target='_blank'
                rel='noopener noreferrer'
                size='sm'
                variant='outline-light'
                className='mb-2'
                icon={<Ticket />}
                iconPosition='right'
              >
                Visit Store
              </Button>
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
                        <Button
                          onClick={() => handleCheckout(product.variantId)}
                          size='sm'
                          variant='danger'
                          disabled={!product.variantId}
                          icon={<CartPlus />}
                          iconPosition='right'
                        >
                          Buy on Shopify
                        </Button>
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
