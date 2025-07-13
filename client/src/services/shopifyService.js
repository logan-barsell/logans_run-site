// Shopify Storefront API integration using fetch
import { handleServiceError } from '../utils/errorHandler';

/**
 * Fetch products from a Shopify collection using the Storefront API.
 * @param {string} shopDomain - The myshopify.com domain (e.g. 'your-store.myshopify.com')
 * @param {string} accessToken - Storefront API access token
 * @param {string} collectionId - Shopify collection ID (numeric or GID)
 * @returns {Promise<Array>} Array of product objects
 */
export async function fetchShopifyProducts(
  shopDomain,
  accessToken,
  collectionId
) {
  try {
    const query = `
      query getProducts($collectionId: ID!, $first: Int!) {
        collection(id: $collectionId) {
          products(first: $first) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Format collectionId as GID if needed
    const formattedCollectionId = collectionId.startsWith('gid://')
      ? collectionId
      : `gid://shopify/Collection/${collectionId}`;

    const requestBody = {
      query,
      variables: {
        collectionId: formattedCollectionId,
        first: 50,
      },
    };

    const response = await fetch(
      `https://${shopDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const edges = data.data.collection?.products?.edges || [];
    return edges.map(edge => {
      const product = edge.node;
      const image = product.images.edges[0]?.node;
      const variant = product.variants.edges[0]?.node;
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        imageUrl: image?.url || '',
        altText: image?.altText || product.title,
        price: variant?.price?.amount || '0',
        currencyCode: variant?.price?.currencyCode || 'USD',
        variantId: variant?.id || '',
      };
    });
  } catch (error) {
    const { message } = handleServiceError(
      error,
      'Failed to fetch Shopify products'
    );
    throw new Error(message);
  }
}

/**
 * Create a Shopify checkout for a given variant using the Storefront API.
 * @param {string} shopDomain - The myshopify.com domain
 * @param {string} accessToken - Storefront API access token
 * @param {string} variantId - Shopify product variant GID
 * @returns {Promise<string>} The checkout webUrl
 */
export async function createShopifyCheckout(
  shopDomain,
  accessToken,
  variantId
) {
  try {
    const mutation = `
      mutation createCheckout($lineItems: [CheckoutLineItemInput!]!) {
        checkoutCreate(input: { lineItems: $lineItems }) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const requestBody = {
      query: mutation,
      variables: {
        lineItems: [
          {
            variantId,
            quantity: 1,
          },
        ],
      },
    };

    const response = await fetch(
      `https://${shopDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    if (data.errors) {
      // Handle common dev store/permission errors gracefully
      const errorMsg = data.errors[0].message;
      if (
        errorMsg.includes("doesn't exist on type 'Mutation'") ||
        errorMsg.includes('ACCESS_DENIED') ||
        errorMsg.includes('Unauthorized')
      ) {
        throw new Error(
          'Shopify checkout is not available. This store may be in development mode, password-protected, or misconfigured. Please contact the store owner.'
        );
      }
      throw new Error(errorMsg);
    }

    const checkoutErrors = data.data?.checkoutCreate?.checkoutUserErrors || [];
    if (checkoutErrors.length > 0) {
      throw new Error(checkoutErrors[0].message);
    }

    return data.data.checkoutCreate.checkout.webUrl;
  } catch (error) {
    // If the error already has a descriptive message, preserve it
    if (
      error.message &&
      error.message.includes('Shopify checkout is not available')
    ) {
      throw error;
    }
    const { message } = handleServiceError(
      error,
      'Failed to create Shopify checkout'
    );
    throw new Error(message);
  }
}
