import React, { useEffect, useState } from 'react'

import { RxCross1 } from "react-icons/rx";
import { useProductContext } from '../context/ProductContext';
import CartItem from './CartItem';
import Button from '../authentication/Button';
import { Link } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js'
import {useNavigate} from 'react-router-dom'
// import {fetchStripeProducts, stripe} from '../Node/stripeIntegrations'
// const { createProductInStripe,fetchStripeProducts,  createProductsInStripe, fetchStripeAllProducts, updateStripeProduct } = require('../Node/stripeIntegrations'); // Adjust the path as needed
import { auth ,db } from "../config/firebase-config";
import Loader from '../authentication/Loader';


let stripePromise;


const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  }

  return stripePromise;
};




const Sidebar = () => {

  let navigate = useNavigate();

  // let allCartItems = localStorage.getItem('cartItems');
  // let readAllCartItems = JSON.parse(allCartItems)


  // console.log('LOCAL CART', readAllCartItems)
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);
                      
    const {cartItem, dispatch , cartHandling ,products , totalQuantity , totalPrice, checkout, localStorageCart, localCartTotalQuantity, localCartTotalPrice, generateUniqueNumberId, saveOrderDataToFireBase, fetchStripeProducts } = useProductContext() 

    const localCartTotalPriceLimited = localCartTotalPrice.toFixed(2)
    const localCartTotalPriceLimitedNumber = parseFloat(localCartTotalPriceLimited)

    const redirectToStripe = async (cartItems) => {


      if(auth?.currentUser?.email == undefined){
        return navigate('/sign-up');
      }
      else{
        setLoading(true);
        const uniqueId = generateUniqueNumberId();
        dispatch({type:'UNIQUE_ID_FOR_ORDER', payload : uniqueId })
        await saveOrderDataToFireBase(uniqueId)
        
      const prices = await fetchStripeProducts();
      console.log(prices);
    
      // Filter the products based on cartItem IDs
      const matchingProducts = prices.filter((product) =>
      localStorageCart.some((cartItemProduct) => cartItemProduct.id === Number(product.product) && product.active == true  )
      );

      console.log(matchingProducts)

    
      // Construct line items from matching products
      const lineItems = matchingProducts.map((product) => {
        const cartItemProduct = localStorageCart.find((cartItemProduct) => cartItemProduct.id === Number(product.product));
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
      
      console.log("redirectToCheckout");
    
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout(checkoutOptions);
      console.log("Stripe checkout error", error);
    
      if (error) setStripeError(error.message);
      setLoading(false);

      }


      
    };

  return (
    <>
        <div className='SideBar_Main'>
          
          <div className='sidebar_second_main'>
            <button className='close_cart_btn' onClick={()=>{cartHandling()}} ><RxCross1 size='25px'/></button>
            <h1>Cart</h1>
            <div className="cart_total_quantity">
              <h4>Total Quantity : {localCartTotalQuantity}</h4>
              
            </div>
            <div className='cartItems'>
                {
                  
                  localStorageCart.map((item , index)=>{
                  const {id ,title , category, description ,image,price ,quantity } = item 
                  const product = products.find(prod => prod.id === id); // Find the corresponding product

                  return <CartItem key={index} item={item} product={product}/>
                })}
              </div>
              <div className="cart_total_price">
              <h3>Total Price : <b>$</b>{localCartTotalPriceLimitedNumber}</h3>
              </div>
              { localStorageCart.length !== 0 ? 
                <div className='cart_checkout_button' >
                <Button title={isLoading? <div style={{height: '20px'}}><Loader size='20px'/></div> : 'Checkout' } onclick={()=>redirectToStripe(localStorageCart)}/>
              </div>
              : <></>
              }
              
            
            
          </div>
          </div>
    </>
  )
}

export default Sidebar