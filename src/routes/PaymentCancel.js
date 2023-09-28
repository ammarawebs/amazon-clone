import React, { useEffect } from 'react'
import { useProductContext } from '../context/ProductContext'
import { useNavigate } from 'react-router-dom'
import { RxCrossCircled } from "react-icons/rx";
import Button from '../authentication/Button';

const PaymentCancel = () => {

  let navigate = useNavigate();
  const { dispatch , getCancelOrdersDataforAdmin, makeOrderCancel} = useProductContext() 

  const NavigateToHome = () =>{
    return navigate('/');
  }


  useEffect(()=>{
    makeOrderCancel()
    getCancelOrdersDataforAdmin()
    dispatch({type : 'EMPTY_CART_ITEMS'})

  },[])


  return (
    <>
        <div className="payment_success_main">
          <div className="payment_success_second_main">
            <h1 >
               Your Order was Canceled
            </h1>
            <p className='order_id_text'>The Payment Was not Completed</p>
            <RxCrossCircled size='30px' color='red'/>
            <br/>
            <Button title='Contiue Shopping' onclick={NavigateToHome} />
          </div>
        </div>
    </>
  )
}

export default PaymentCancel