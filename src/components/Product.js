import React from 'react'
import { Link } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'

const Product = (post) => {


const { GettingCartItem} = useProductContext()


    const {id ,title , category, description ,image,price } = post 
  return (
    
        <div className='card' >
            <div className='card_img_section'>
              <img src={image} alt="" className='card_image'/>
            </div>
            
            <div className='product_detail_section'>
            <h3 className="card_cat">{category}</h3>
            <Link to={`/products/${id}`}><h2 className='card_title'>{title}</h2></Link>
            <p className='price'>$ {price}</p>
            <button className='buy_btn' onClick={()=>{GettingCartItem(post)}} >Add to Cart</button>
            
            </div>
           
            
          </div>
    
    
  )
}

export default Product