import './cartItem.css';
import React from 'react';
import { removeProductFromCart, changeProductQuantity, changeProductSize } from '../../../redux/cartRedux';
import { useDispatch } from 'react-redux';

const CartItem = ({ item }) => {
  const sizes = item.product.metadata.sizes.split(', ');
  console.log(item.product.metadata.sizes.split(', '));

  const dispatch = useDispatch();

  const changeSize = size => {
    dispatch(changeProductSize({id: item._id, size}));
  };

  const changeQuantity = q => {
    if(q === 1) {
      dispatch(changeProductQuantity({id: item._id, quantity: item.quantity + 1}));
    } else if (q === -1 && item.quantity > 1) {
      dispatch(changeProductQuantity({id: item._id, quantity: item.quantity - 1}));
    }
  }  

  const removeFromCart = item => {
    dispatch(removeProductFromCart(item._id));
  };

  return (
    <div className="cartItem row justify-content-between">
        <div className="col-12 col-md-5">
            <img className="img-thumbnail" src={item.product.images[0]}/>
            <div className="productName">
              {item.product.name}
            </div>
        </div>
        <div className="col-12 col-md-3 midCol">
          <form className="productSize">
            <div className="btn-group" role="group" aria-label="Product Sizes">
              {sizes.map((size, index) => (
                <React.Fragment key={`${index}${item._id}`}>
                 <input defaultChecked={size==='MD'} type="radio" onClick={() => changeSize(size)} value={size} className="btn-check" name="options" id={`${item._id}${index}`} autoComplete="off"/>
                 <label className="btn btn-sm btn-outline-light" htmlFor={`${item._id}${index}`}>{size}</label>
                </React.Fragment>
              ))}
            </div>
          </form>
          <div className="productQuantity">
            <svg onClick={() => changeQuantity(-1)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#E3FF05" className="bi bi-dash-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
            </svg>
            {String(item.quantity).replace("0", "O")}
            <svg onClick={() => changeQuantity(1)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#E3FF05" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
            </svg>
          </div>
        </div>
        <div className="col-12 col-md-3 endCol">
          <span></span>
          <span className="productPrice">
            ${String((item.price.unit_amount/ 100) * item.quantity).replace("0", "O")}
          </span>
          <button onClick={() => removeFromCart(item)} className="btn btn-sm btn-light">Remove</button>
        </div>
    </div>
  );
};

export default CartItem;
