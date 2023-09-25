import React, { useEffect, useState } from 'react'

import { RxCross1 } from "react-icons/rx";
import { useProductContext } from '../context/ProductContext';
import CartItem from './CartItem';
import Button from '../authentication/Button';
import { Link } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js'
import {fetchStripeProducts, stripe} from '../Node/stripeIntegrations'


let stripePromise;


const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  }

  return stripePromise;
};




const Sidebar = () => {

  
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);

    const {cartItem, cartHandling ,products , totalQuantity , totalPrice, checkout } = useProductContext() 

    const redirectToStripe = async (cartItems) => {
      const products = await fetchStripeProducts();
      console.log(products);
    
      // Filter the products based on cartItem IDs
      const matchingProducts = products.filter((product) =>
        cartItem.some((cartItemProduct) => cartItemProduct.id === Number(product.product))
      );
    
      // Construct line items from matching products
      const lineItems = matchingProducts.map((product) => {
        const cartItemProduct = cartItem.find((cartItemProduct) => cartItemProduct.id === Number(product.product));
        return {
          price: product.id,
          quantity: cartItemProduct ? cartItemProduct.quantity : 1, // Use cartItemProduct.quantity if available, otherwise default to 1
        };
      });
      // console.log(matchingProducts)
    
      const checkoutOptions = {
        lineItems,
        mode: "payment",
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      };
    
      // Redirect to Stripe checkout
      setLoading(true);
      console.log("redirectToCheckout");
    
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout(checkoutOptions);
      console.log("Stripe checkout error", error);
    
      if (error) setStripeError(error.message);
      setLoading(false);
    };

  return (
    <>
        <div className='SideBar_Main'>
          
          <div className='sidebar_second_main'>
            <button className='close_cart_btn' onClick={()=>{cartHandling()}} ><RxCross1 size='25px'/></button>
            <h1>Cart</h1>
            <div className="cart_total_quantity">
              <h4>Total Quantity : {totalQuantity}</h4>
              
            </div>
            <div className='cartItems'>
                {cartItem.map((item , index)=>{
                  const {id ,title , category, description ,image,price ,quantity } = item 
                  const product = products.find(prod => prod.id === id); // Find the corresponding product

                  return <CartItem key={index} item={item} product={product}/>
                })}
              </div>
              <div className="cart_total_price">
              <h3>Total Price : <b>$</b>{totalPrice}</h3>
              </div>
              { cartItem.length !== 0 ? 
                <div className='cart_checkout_button' >
                <Button title={isLoading? 'loading...' : 'Checkout' } onclick={()=>redirectToStripe(cartItem)}/>
              </div>
              : <></>
              }
              
            
            
          </div>
          </div>
    </>
  )
}

export default Sidebar