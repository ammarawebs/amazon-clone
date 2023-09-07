import React from 'react'
import { BsPlus ,BsDash } from "react-icons/bs"
import { useProductContext } from '../context/ProductContext'

const CartItem = ({item , product}) => {

    const {cartItemIncreament ,cartItemDecreament} = useProductContext()

    const {id ,title , category, description ,image,price ,quantity } = item 
  return (
    <div className='cartItem'>
    <div className="cart_img_sec">
      <img src={image} alt="" className='cart_image'/>
    </div>
    <div className='cart_details'>
      <div className='cart_title'>
      <div>
         <p className='cart_title_title'>{title}</p>
      </div>
      <div className='quantity_btns'>
          <div><button onClick={()=>{cartItemDecreament(item , product)}}> <BsDash/> </button></div>
          <p> {quantity} </p>
          <div><button onClick={()=>{cartItemIncreament(item, product)}}><BsPlus/></button></div>
          
      </div>
      
      </div>
      
      <div className='cart_price' ><p >${price}</p></div>
    </div>
    
  </div>
  )
}

export default CartItem