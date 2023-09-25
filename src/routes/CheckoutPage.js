// Checkout.js
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Checkout = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
  };

  return (
    <div className='checkout_page'>
      {/* {paymentComplete ? ( */}
        <div>
          <h2>Payment Successful!</h2>
          {/* You can show an order summary or a thank you message here */}
        </div>
      {/* ) : ( */}
        <div>
          <h2>Checkout</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm onComplete={handlePaymentComplete} />
          </Elements>
        </div>
      {/* )} */}
    </div>
  );
};

export default Checkout;
