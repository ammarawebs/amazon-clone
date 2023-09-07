import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import Pagenavigation from '../components/Pagenavigation'
import AddToCart from '../components/AddToCart'





const API = 'https://fakestoreapi.com/products'

const Single_product = () => {
  

  


  const {isSinlgleLoading, singleProduct ,getSingleProduct } = useProductContext()
  

  const {id} = useParams()

  const { category, description, image , price, rating, title  } = singleProduct;
  
  
  
  
  
  // console.log(rating.rate)

  useEffect(()=>{
    getSingleProduct(`${API}/${id}`)

  },[])


  return (
    <>  
    <Pagenavigation title={title}/>
    <div  className='sp_loading'>
      { isSinlgleLoading  ? <h1>loading...</h1> : <div className='single_product_main'>
          <div className="single_product_second_main">
            <div className="sp_image_sec">
              <img className='sp_image' src={image} alt="" />
            </div>
            <div className="sp_product_details">
                <p className='sp_cat'>{category}</p>
                <h1 className='sp_title'>{title}</h1>
                {/* <p>{rating.rate}</p> */}
                <h1 className='sp_price'>$ {price}</h1>
                <p className='sp_description'>{description  }</p>
                 <AddToCart product = {singleProduct} />  
            </div>
          </div> 
      </div>
         }  
         </div>
      

      
        
    </>
  )
}

export default Single_product