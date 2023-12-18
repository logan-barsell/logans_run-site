import './Merch.css';
import logo from '../../images/logos/vango.png';
import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import Products from './Products';
import { Toast } from 'bootstrap';

const MerchPage = () => {

 useEffect(() => {
   const searchParams = new URLSearchParams(window.location.search);
   if(searchParams.has('success')) {
     localStorage.clear();
     window.location = '/merch?thankyou';
   }
 });

 useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const thankyouToast = document.getElementById('thankyouToast');
  const toast = new Toast(thankyouToast);
  if(searchParams.has('thankyou')) {
    toast.show();
  }
 })

  const ThankYouToast = () => {
    return (
      <div className="toast-container position-fixed top-3 start-1 p-3">
        <div id="thankyouToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <img src={logo} className="rounded me-2" alt="devil logo"/>
            <strong className="me-auto">Logan's Run</strong>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            Thanks for your purchase!
          </div>
        </div>
      </div>
    );
  };


  return (
    <div id="merch" className="fadeIn">

      <SecondaryNav label='Merchandise' />
      <ThankYouToast/>
      <div className="row container justify-content-center py-3 py-lg-4" id="product-list">
        <Products />
      </div>
    </div>

  );
}

export default MerchPage;