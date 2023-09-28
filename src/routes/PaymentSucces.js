import React, { useEffect, useLayoutEffect } from 'react'
import { useProductContext } from '../context/ProductContext'
import { useNavigate } from 'react-router-dom'
import { auth ,db } from '../config/firebase-config'
import Button from '../authentication/Button'
import { BiCheckCircle } from "react-icons/bi";
import { Link } from 'react-router-dom';



const PaymentSucces = () => {
  
    let navigate = useNavigate();
    const { localStorageCart, makeOrderComplete , localOrderId } = useProductContext() 


    const NavigateToHome = () =>{
      return navigate('/');
    }

    useEffect(()=>{
      makeOrderComplete()
    },[])



  return (
    <>
        
        <div className="payment_success_main">
          <div className="payment_success_second_main">
            <h1 >
              Congratulation Your Order is Completed
            </h1>
            <p className='order_id_text'>Your Order id is : {localOrderId}</p>
            <BiCheckCircle size='30px' color='green'/>
            <br/>
            <Button title='Contiue Shopping' onclick={NavigateToHome} />
          </div>
        </div>
    </>
  )
}

export default PaymentSucces