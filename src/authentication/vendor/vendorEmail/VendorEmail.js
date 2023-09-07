import React from 'react'
import { useProductContext } from '../../../context/ProductContext';
import { Link } from 'react-router-dom';
import FeaturesHeading from './FeaturesHeading';
import { auth ,db } from "../../../config/firebase-config";
import ErrorBox from '../../ErrorBox';
import { AiOutlineLoading } from "react-icons/ai";




const VendorEmail = () => {


 

  const { vendor , dispatch, vendorEmail  ,vendorError ,vendorLoading , vendorInputError } = useProductContext()

  const errorStyle= {
    border:  '2px solid red',
    borderRadius : '5px',
    fontSize : '14px',
    padding: '7px 12px' ,
    marginBottom : '15px',
    backgroundColor : 'rgba(255, 0,0,0.03)',
  }
  
  const style = {
    border:  '1px solid rgba(0, 0, 0, 0.4)',
    borderRadius : '5px',
    fontSize : '14px',
    padding: '7px 12px' ,
    marginBottom : '15px',
    
  }


  // if(auth?.currentUser?.email !== undefined){
  //   dispatch({type: 'SET_VENDOR_EMAIL_TO_LOGIN_EMAIL' ,  payload: auth?.currentUser?.email })
  // } 



  return (
    <>
        { vendorError.email === 'empty-fields'   ?  <ErrorBox color='red' heading='There was a Problem' msg='Some input fields are empty please fill them' /> 
        : vendorError.email === 'auth/invalid-email'   ?  <ErrorBox color='red' heading='There was a Problem' msg='The email address is invalid please enter the right email' /> 
        : vendorError.email === 'auth/network-request-failed'   ?  <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' /> 
        : vendorError.email === 'auth/email-already-in-use'   ?  <ErrorBox color='red' heading='There was a Problem' msg='This email address is already in use please try another email or login' /> 
        : vendorError.email === 'signIn' ? <ErrorBox color='green' heading='Sign Up Successful' msg='you are successfully registered to the site' />
        : vendorError.email === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
        : vendorLoading ? <div className='loading_icon'><AiOutlineLoading size='30px' /></div> : <></> }

        <div className="vendorEmail">
          <div className="mainVendorEmail">
            <div className="vendorEmailSection">
              <h1 className="vendorEmailHeading">
                Let's create your Free Business Account
              </h1>
              <p className="vendorEmailLabel">
                Enter the email you'd like to use for your business account
              </p>
              <form className='vendorEmailForm' action="" onSubmit={vendorEmail}>
                <input type="email" className='auth_input' style={vendorError.email ==='empty-fields' || vendorInputError.email? errorStyle : style}  value={auth?.currentUser?.email !== undefined? auth.currentUser.email : vendor.email} onChange={(e)=>{dispatch({type: 'VENDOR_EMAIL_ONCHANGE' , payload: e.target.value  })}}/>
                <button type='submit' className='auth_sign_up_button' style={{background: '#f90'}} >Get Started</button>
              </form>
              <div className="vendorEmailSignIn">
                <p className="alreadySellerSignIn">Already Business Customer then <Link>Sign in</Link></p>
              </div>
            </div>
            <div className="vendorDesignSection">
              <h1 className="vendorEmailHeading">Added value for every type of organization</h1>
              <FeaturesHeading icon='https://m.media-amazon.com/images/G/01/AmazonBusiness/Registration/desktop/icon-savings.svg' heading='Buy more, save more' title='From commerce to education, save on over 60 million products when you buy two or more.'/>
              <FeaturesHeading icon='https://m.media-amazon.com/images/G/01/AmazonBusiness/Registration/desktop/icon-addusers.svg' heading='Connect your people' title='Create groups, share payment methods, and manage supplies across locations.' />
              <FeaturesHeading icon='https://m.media-amazon.com/images/G/01/AmazonBusiness/Registration/desktop/icon-bp.svg' heading='Get fast, FREE shipping with Business Prime' title='Just one Business Prime membership covers unlimited free shipping on eligible orders for your entire organization.'/>
              <img className='vendorEmailIconDesign' src="https://m.media-amazon.com/images/I/416LUsi8c6L.svg" />
            </div>
          </div>
        </div>
    </>
  )
}

export default VendorEmail