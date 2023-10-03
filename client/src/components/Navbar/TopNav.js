import './TopNav.css';

import React, { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import NavLink from '../Routing/NavLink';
import { Collapse } from 'bootstrap';
import { ActiveContext } from '../../App';
import Cart from './cart/Cart';
import { createPortal } from 'react-dom';

const TopNav = ({ routes }) => {
  const cart = useSelector(state => state.cart);
  const ref = useRef();
  const { toggle, setToggle } = useContext(ActiveContext);

  const menuToggle = () => {
    setToggle(toggle => !toggle);
  }

  useEffect(() => {
    const menuCollapse = document.getElementById('menu');
    const bsCollapse = new Collapse(menuCollapse, {
      toggle: false
    });
    toggle ? bsCollapse.show() : bsCollapse.hide();

    const onBodyClick = (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setToggle(false);
    };

    document.body.addEventListener('click', onBodyClick);

    return () => {
      document.body.removeEventListener('click', onBodyClick);
    };

  });

  const renderCart = () => {
    const cartContainer = document.querySelector('.cart-container');
    return createPortal(<Cart/>, cartContainer);
  }

  return (
    <nav ref={ref} className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand yesdevil hvr-grow" href=".">YES DEVIL</a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => menuToggle()}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <div className="navbar-nav justify-content-around">
            <NavLink routes={routes} menuToggle={menuToggle} />
            <a href="#!" className="nav-item nav-link">
              <button 
                type="button" 
                className="btn btn-danger cart-button" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#shoppingCart" 
                aria-controls="shoppingCart"
                onClick={() => toggle && menuToggle()}
              >
                Cart 
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                </svg>
              </button>
              {renderCart()}
              { cart.products.length > 0 &&
                <span className="cartQuantity position-absolute top-10 start-10 translate-middle badge bg-danger">
                  {cart.products.length}
                </span>
              }
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;