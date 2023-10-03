import './merchEdit.css';
import React from 'react';

const MerchEdit = () => {
  return (
    <div id="merchEdit" class="container">
      <h3>Managed by Stripe:</h3>
      <p>To manage products, inventory, view orders, and more - please visit the Stripe Dashboard.</p>
      <a href="https://dashboard.stripe.com/dashboard" target="_blank" rel="noreferrer">
        <button type="button" className="btn btn-danger">
          Go to Stripe Dashboard 
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
           <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
          </svg>  
        </button>
      </a>
    </div>
  );
}

export default MerchEdit;