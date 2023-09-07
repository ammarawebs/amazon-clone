import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { AiOutlineLoading } from "react-icons/ai";
import { useProductContext } from '../../context/ProductContext';
import { auth ,db } from "../../config/firebase-config";
import ErrorBox from '../ErrorBox';


const VendorDetails = () => {
  

  const {dispatch , createUser , vendor ,vendorInputError, vendorError, vendorLoading, vendorDetails } = useProductContext()


  
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

    
  return (
    <>

{ vendorError.details === 'empty-fields'   ?  <ErrorBox color='red' heading='There was a Problem' msg='Some input fields are empty please fill them' /> 
        : vendorError.details === 'auth/invalid-email'   ?  <ErrorBox color='red' heading='There was a Problem' msg='The email address is invalid please enter the right email' /> 
        : vendorError.details === 'auth/network-request-failed'   ?  <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' /> 
        : vendorError.details === 'auth/email-already-in-use'   ?  <ErrorBox color='red' heading='There was a Problem' msg='This email address is already in use please try another email or login' /> 
        : vendorError.details === 'signIn' ? <ErrorBox color='green' heading='Sign Up Successful' msg='you are successfully registered to the site' />
        : vendorError.details === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
        : vendorLoading ? <div className='loading_icon'><AiOutlineLoading size='30px' /></div> : <></> }

      <div className="auth_main">
        <div className="auth_second_main">
        
       
          <div className="auth_box" style={{border : 'none'}}>

          

            <div className="auth_heading_div">
              <h1 className='Vendor_details_heading'>Enter your full name and choose your business password</h1>
            </div>
            <div className="auth_input_section">
                <form className="auth_input_section" action="" onSubmit={vendorDetails}> 
                <label htmlFor="auth_fname" className='auth_label'>first name</label>
                <input type="text" id='auth_fname' className='auth_input'  value={vendor.firstname} style={vendorInputError.fname? errorStyle : style} onChange={(e)=>dispatch({type : 'VENDOR_FNAME' , payload : e.target.value})} />

                <label htmlFor="auth_fname" className='auth_label'>Last name</label>
                <input type="text" id='auth_lname' className='auth_input' value={vendor.lastname} style={vendorInputError.lname? errorStyle : style}  onChange={(e)=>dispatch({type : 'VENDOR_LNAME' , payload : e.target.value})} />

            
                <label htmlFor="auth_email" className='auth_label'>email</label>
                <input type="email" id='auth_email' className='auth_input' value={auth?.currentUser?.email !== undefined? auth.currentUser.email : vendor.email} style={vendorInputError.email? errorStyle : style}  onChange={(e)=>dispatch({type : 'VENDOR_EMAIL' , payload : e.target.value})} />
    
              
                { auth?.currentUser?.email !== undefined ? <></>:
                <>                  <label htmlFor="auth_password"  className='auth_label'>password</label>
                <input type="password" id='auth_password' className='auth_input' value={vendor.password} style={vendorInputError.password? errorStyle : style}   onChange={(e)=>dispatch({type : 'VENDOR_PASSWORD' , payload : e.target.value})} /></>
}

                <label htmlFor="vendor_phone"  className='auth_label'>phone number</label>
                <input type="tel" id='vendor_phone' className='auth_input' value={vendor.phone} style={vendorInputError.phone? errorStyle : style}   onChange={(e)=>dispatch({type : 'VENDOR_PHONE' , payload : e.target.value})} />
      
              <div className="auth_submit_button">
                <button type='submit' className='auth_sign_up_button'>Next Step</button>
              </div>
              </form>
              {/* <div className="auth_signup_google">
                <button className='auth_sign_up_google' onClick={signUpWithGoogle}><FcGoogle  size='20'/>&nbsp;  Sign up with Google</button>
              </div> */}
              <p className='auth_agree'>By creating an account, you agree to our Conditions of Use and Privacy Notice.</p>
              <div className='auth_divider'>
                <div className='auth_divider_inner'>

                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VendorDetails