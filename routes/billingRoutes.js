// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET) {
    console.warn(
      '⚠️  STRIPE_SECRET environment variable is not set. Stripe functionality will be disabled.'
    );
    stripe = null;
  } else {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
  }
} catch (error) {
  console.error('❌ Failed to initialize Stripe:', error.message);
  stripe = null;
}

const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(
  __dirname,
  '../config/serviceAccountKey.json'
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com', // update if your bucket is different
  });
}
const bucket = admin.storage().bucket();

// Helper function to check if Stripe is available
const checkStripeAvailable = res => {
  if (!stripe) {
    res.status(503).json({ error: 'Stripe is not configured' });
    return false;
  }
  return true;
};

module.exports = app => {
  app.get('/api/products', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    try {
      const products = await stripe.products.list({
        active: true,
        limit: 100,
      });
      // Sort products by creation date (oldest first)
      products.data.sort((a, b) => a.created - b.created);
      const productList = [];
      await Promise.all(
        products.data.map(async product => {
          // Skip products without a default_price
          if (!product.default_price) {
            console.warn(
              `Product ${product.id} (${product.name}) has no default_price, skipping`
            );
            return;
          }

          try {
            const price = await stripe.prices.retrieve(product.default_price);
            productList.push({ product, price, quantity: 1, size: 'MD' });
          } catch (priceError) {
            console.error(
              `Failed to retrieve price for product ${product.id}:`,
              priceError.message
            );
            // Skip this product if price retrieval fails
          }
        })
      );

      res.send(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    const products = JSON.parse(Object.keys(req.body)[0]);
    const productlist = [];
    await Promise.all(
      products.map(async product => {
        const price = await stripe.prices.retrieve(product.price);
        const findProduct = await stripe.products.retrieve(price.product);
        productlist.push({
          quantity: product.quantity,
          price_data: {
            unit_amount: price.unit_amount,
            currency: 'usd',
            product_data: {
              name: `${findProduct.name} | ${product.size} `,
              description: findProduct.description,
              images: findProduct.images,
              metadata: {
                size: product.size,
              },
            },
          },
        });
      })
    );
    const session = await stripe.checkout.sessions.create({
      line_items: productlist,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate: process.env.SHIPPING_RATE_ID,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.STRIPE_REDIRECT_DOMAIN}/merch?success=true`,
      cancel_url: `${process.env.STRIPE_REDIRECT_DOMAIN}/merch?canceled=true`,
    });
    res.send(session.url);
  });

  app.get('/api/shipping', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    try {
      const shippingRate = await stripe.shippingRates.retrieve(
        process.env.SHIPPING_RATE_ID
      );
      res.send(shippingRate);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Create a new product (expects images as array of public URLs)
  app.post('/api/products', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    try {
      const { name, description, sizes, price, images = [] } = req.body;
      const product = await stripe.products.create({
        name,
        description,
        images,
        metadata: { sizes },
        default_price_data: {
          unit_amount: price,
          currency: 'usd',
        },
      });
      res.send({ product, price: product.default_price });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Update an existing product (can update image URL)
  app.put('/api/products/:id', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    try {
      const { name, description, images, sizes, oldImageUrl } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (images) updateData.images = images;
      if (sizes) updateData.metadata = { sizes };
      const updatedProduct = await stripe.products.update(
        req.params.id,
        updateData
      );
      // If oldImageUrl is provided and different from new image, delete old image from Firebase
      if (oldImageUrl && images && images[0] && oldImageUrl !== images[0]) {
        // Extract the full path between '/o/' and '?'
        const match = oldImageUrl.match(/\/o\/([^?]+)/);
        if (match && match[1]) {
          const filePath = decodeURIComponent(match[1]);
          await bucket
            .file(filePath)
            .delete()
            .catch(err => {
              console.error('Firebase delete error:', err);
            });
        } else {
          console.warn(
            'Could not extract Firebase file path from URL:',
            oldImageUrl
          );
        }
      }
      res.send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // Remove (deactivate) a product and its prices, and optionally delete Firebase image
  app.delete('/api/products/:id', async (req, res) => {
    if (!checkStripeAvailable(res)) return;

    try {
      // Set product as inactive
      const product = await stripe.products.update(req.params.id, {
        active: false,
      });
      // Get all prices for this product
      const prices = await stripe.prices.list({ product: req.params.id });
      // Set all prices as inactive
      await Promise.all(
        prices.data.map(price =>
          stripe.prices.update(price.id, { active: false })
        )
      );
      // Optionally delete image from Firebase if image URL is provided in query
      const imageUrl = req.query.imageUrl;
      if (imageUrl) {
        const match = imageUrl.match(/\/o\/([^?]+)/);
        if (match && match[1]) {
          const filePath = decodeURIComponent(match[1]);
          console.log('Attempting to delete Firebase file:', filePath);
          await bucket
            .file(filePath)
            .delete()
            .catch(err => {
              console.error('Firebase delete error:', err);
            });
        } else {
          console.warn(
            'Could not extract Firebase file path from URL:',
            imageUrl
          );
        }
      }
      res.send({ product, prices: prices.data });
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
