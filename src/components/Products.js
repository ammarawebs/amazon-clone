import React from 'react'
import { useProductContext } from '../context/ProductContext'
import Product from './Product'


const Products = () => {

    const {isLoading , products } = useProductContext()
    // console.log(products)
    
   

  return (
    <>
        {isLoading ? <h1>loading ... </h1> : <div className='second_main'>
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