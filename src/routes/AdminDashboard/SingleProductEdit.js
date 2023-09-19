import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../context/ProductContext'



const SingleProductEdit = () => {


const {dispatch} = useProductContext()
const {id} = useParams()

  return (
    <>
        <h1>This product number is {id}</h1>
    </>
  )
}

export default SingleProductEdit