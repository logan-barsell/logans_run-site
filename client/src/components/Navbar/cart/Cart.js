import './cart.css';
import React, { useEffect } from 'react';
import axios from 'axios';
import CartItem from './CartItem';
import { useSelector, connect } from 'react-redux';
import { fetchShipping } from '../../../redux/actions';

const Cart = ({ fetchShipping, shipping }) => {
  const cart = useSelector(state => state.cart);

  const cartDetails = cart.products.map(cartItem => ({
      price: cartItem.product.default_price,
      quantity: cartItem.quantity,
      size: cartItem.size
  }));

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/create-checkout-session', cartDetails, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
      window.location.href = response.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, [fetchShipping]);

  const subTotal = cart.total / 100;
  const shippingCost = shipping.fixed_amount ? shipping.fixed_amount.amount : 0;
  const shippingAmount = shippingCost ? `$${shippingCost}` : 'Free';
  const totalCost = shippingCost + subTotal;
  
  

  return (
    <div>
      <div className="offcanvas offcanvas-end text-bg-dark" data-bs-backdrop="false" tabIndex="-1" id="shoppingCart" aria-labelledby="cartLabel">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="cartLabel">Shopping Cart</h5>
            <button onClick={e => e.stopPropagation()} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="whitesmoke" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
              </svg>
            </button>
            {/* <button onClick={e => e.stopPropagation()} type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
        </div>
        <div className="offcanvas-body">
          <div className="productsContainer">
            {cart.products.length ?
              cart.products.map((item, index) => (
                <div key={`id_${index}`}>
                  <CartItem item={item} />
                  { index < cart.products.length -1 &&
                    <hr />
                    }
                </div>
              )
              ) : 
              <div style={{
                "textAlign": 'center',
                'height': '50vh',
                'display': 'flex',
                'flexDirection': 'column',
                'justifyContent': 'center',
                'alignItems': 'center'
              }}>
                <h1 
                  style={{
                    "textAlign": 'center',
                    'color': 'darkred',
                    'marginBottom': '25px'
                }}>
                    Your Cart is Empty
                </h1>
                <button onClick={e => e.stopPropagation()} type="button" className="btn btn-dark" data-bs-dismiss="offcanvas" aria-label="Close">Continue Shopping</button>
              </div>
            }
          </div>
          <div className='orderSummary pb-4'>
            <h5>Order Summary</h5>
            <div className="orderDetails">
              <div><span>SubTotal:</span>&nbsp; ${subTotal}</div>
              <div><span>Shipping:</span>&nbsp; {shippingAmount}</div>
              <div className="totalCost"><span>Total:</span>&nbsp; ${totalCost}</div>
            </div>
            <div className="">
              {cart.products.length ?
                <button onClick={handleCheckout} type="button" className="btn btn-danger">Checkout</button>
                : <button disabled type="button" className="btn btn-danger">Checkout</button>
              }
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ shipping }) {
  return { shipping }
}
export default connect(mapStateToProps, { fetchShipping })(Cart);
