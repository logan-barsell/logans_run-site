// Shopify Storefront API integration using fetch
import { handleServiceError } from '../lib/errorHandler';

/**
 * Make a GraphQL request to Shopify Storefront API
 * @param {string} shopDomain - The myshopify.com domain
 * @param {string} accessToken - Storefront API access token
 * @param {string} query - GraphQL query string
 * @param {Object} variables - GraphQL variables
 * @returns {Promise<Object>} Response data and metadata
 */
async function makeShopifyRequest(shopDomain, accessToken, query, variables) {
  try {
    const response = await fetch(
      `https://${shopDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      }
    );

    const data = await response.json();

    return {
      data,
      response: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
    };
  } catch (error) {
    const { message } = handleServiceError(error, {
      operation: 'makeShopifyRequest',
    });
    throw new Error(message);
  }
}

/**
 * Format collection ID as GID if needed
 * @param {string} collectionId - Collection ID (numeric or GID)
 * @returns {string} Formatted GID
 */
function formatCollectionId(collectionId) {
  return collectionId.startsWith('gid://')
    ? collectionId
    : `gid://shopify/Collection/${collectionId}`;
}

/**
 * Handle Shopify API errors and return structured error information
 * @param {Object} data - GraphQL response data
 * @param {Object} response - HTTP response metadata
 * @returns {Object|null} Error object or null if no errors
 */
function handleShopifyErrors(data, response) {
  // Check for GraphQL errors
  if (data.errors && data.errors.length > 0) {
    const error = data.errors[0];
    return {
      message: error.message,
      extensions: error.extensions,
      code: error.extensions?.code,
      response: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  }

  // Check for HTTP errors
  if (!response.ok) {
    return {
      message: `HTTP ${response.status}: ${response.statusText}`,
      extensions: { code: 'HTTP_ERROR' },
      response: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  }

  return null;
}

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

    const variables = {
      collectionId: formatCollectionId(collectionId),
      first: 50,
    };

    const { data, response } = await makeShopifyRequest(
      shopDomain,
      accessToken,
      query,
      variables
    );

    // Handle errors
    const error = handleShopifyErrors(data, response);
    if (error) {
      throw new Error(error.message);
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
    const { message } = handleServiceError(error, {
      operation: 'fetchShopifyProducts',
    });
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

    const variables = {
      lineItems: [
        {
          variantId,
          quantity: 1,
        },
      ],
    };

    const { data } = await makeShopifyRequest(
      shopDomain,
      accessToken,
      mutation,
      variables
    );

    // Handle GraphQL errors
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
    const { message } = handleServiceError(error, {
      operation: 'createShopifyCheckout',
    });
    throw new Error(message);
  }
}

/**
 * Validate Shopify configuration by making a test API call
 * @param {string} shopDomain - The myshopify.com domain
 * @param {string} storefrontAccessToken - Storefront API access token
 * @param {string} collectionId - Shopify collection ID
 * @returns {Promise<Object>} Validation result with success/error information
 */
export async function validateShopifyConfig(
  shopDomain,
  storefrontAccessToken,
  collectionId
) {
  try {
    const query = `
      query getCollection($id: ID!) {
        collection(id: $id) {
          id
          title
          products(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
              }
            }
          }
        }
      }
    `;

    const variables = {
      id: formatCollectionId(collectionId),
    };

    const { data, response } = await makeShopifyRequest(
      shopDomain,
      storefrontAccessToken,
      query,
      variables
    );

    // Handle errors
    const error = handleShopifyErrors(data, response);
    if (error) {
      return {
        success: false,
        error,
        response: error.response,
      };
    }

    // Check if collection exists and has products
    if (!data.data?.collection) {
      return {
        success: false,
        error: {
          message: 'Collection not found or not accessible',
          extensions: { code: 'COLLECTION_NOT_FOUND' },
          response: {
            status: response.status,
            statusText: response.statusText,
          },
        },
        response: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    }

    // Check if the collection has the expected fields (indicates it's a valid collection)
    if (!data.data.collection.id || !data.data.collection.title) {
      return {
        success: false,
        error: {
          message: 'Collection not found or not accessible',
          extensions: { code: 'COLLECTION_NOT_FOUND' },
          response: {
            status: response.status,
            statusText: response.statusText,
          },
        },
        response: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    }

    // Success - configuration is valid
    return {
      success: true,
      data: data.data.collection,
      response: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  } catch (error) {
    // Network or other errors
    let errorCode = 'NETWORK_ERROR';
    let errorMessage = error.message;

    // Check for specific network errors that indicate invalid domain
    if (
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('ERR_NAME_NOT_RESOLVED') ||
      error.message.includes('ENOTFOUND')
    ) {
      errorCode = 'SHOP_NOT_FOUND';
      errorMessage =
        'The specified shop domain could not be found or is invalid.';
    }

    return {
      success: false,
      error: {
        message: errorMessage,
        extensions: { code: errorCode },
      },
      response: null,
    };
  }
}

/**
 * Helper function to check if Shopify config is complete
 * @param {Object} merchConfig - Merchandise configuration object
 * @returns {boolean} True if all required Shopify fields are present
 */
export function isShopifyConfigComplete(merchConfig) {
  return (
    merchConfig?.storeType === 'SHOPIFY' &&
    merchConfig?.shopDomain &&
    merchConfig?.storefrontAccessToken &&
    merchConfig?.collectionId
  );
}
