import React from 'react'
import { useProductContext } from '../context/ProductContext'
import Product from './Product'
import Loader from '../authentication/Loader'


const Products = () => {

    const {isLoading , products } = useProductContext()
    // console.log(products)
    
   

  return (
    <>
        {isLoading ? <Loader marginTop='100px' size='40px'/> : <div className='second_main'>
      {
        
    products.map((post, index)=>{
          return <Product key={index} {...post}/>
          })
        }
      </div> }
       
    </>
  )
}

export default Products