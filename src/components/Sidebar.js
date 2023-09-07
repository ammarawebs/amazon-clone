import React from 'react'

import { RxCross1 } from "react-icons/rx";
import { useProductContext } from '../context/ProductContext';
import CartItem from './CartItem';

const Sidebar = () => {

    const {cartItem, cartHandling ,products , totalQuantity , totalPrice} = useProductContext() 

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
            
            
          </div>
          </div>
    </>
  )
}

export default Sidebar