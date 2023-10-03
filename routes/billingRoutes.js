const stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports = app => {

    app.get('/api/products', async (req, res) => {
        const products = await stripe.products.list({
            limit: 2,
        });
        const productList = [];
        await Promise.all(products.data.map(async product => {
            const price = await stripe.prices.retrieve(
                product.default_price
            );
            productList.push({product, price, quantity: 1, size: 'MD'});
        }));
        
        res.send(productList);
    });

    app.post('/api/create-checkout-session', async (req, res) => {
        const products = JSON.parse(Object.keys(req.body)[0]);
        const productlist = [];
        await Promise.all(products.map(async product => {
            const price = await stripe.prices.retrieve(
                product.price
            );
            const findProduct = await stripe.products.retrieve(
                price.product
            );
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
                            size: product.size
                        }
                    }
                }
            });
        }));
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
          cancel_url: `${process.env.STRIPE_REDIRECT_DOMAIN}/merch?canceled=true`
        });
        res.send(session.url);
    });

    app.get('/api/shipping', async (req, res) => {
        try {
            const shippingRate = await stripe.shippingRates.retrieve(
                process.env.SHIPPING_RATE_ID
            );
            res.send(shippingRate);
        } catch (err) {
            res.status(500).send(err);
        }
    })
      

}