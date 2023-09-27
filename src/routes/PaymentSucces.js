import React from 'react'
import { useProductContext } from '../context/ProductContext'

import { auth ,db } from '../config/firebase-config'

const PaymentSucces = () => {

    const { localStorageCart } = useProductContext() 



  return (
    <>
        <h1 style={{marginTop : '50px' , marginLeft: '50px'}}>
            Congratulation 🚀 Your Order is Completed
        </h1>
    </>
  )
}

export default PaymentSucces