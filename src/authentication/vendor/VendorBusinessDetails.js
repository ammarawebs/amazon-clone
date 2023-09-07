import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { AiOutlineLoading } from "react-icons/ai";
import { useProductContext } from '../../context/ProductContext';
import ErrorBox from '../ErrorBox';

const VendorBusinessDetails = () => {
  
        const {dispatch , createUser , vendor ,vendorInputError, vendorError, vendorLoading, vendorBusinessDetails } = useProductContext()


  
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

{ vendorError.business === 'empty-fields'   ?  <ErrorBox color='red' heading='There was a Problem' msg='Some input fields are empty please fill them' /> 
      : vendorError.business === 'auth/invalid-email'   ?  <ErrorBox color='red' heading='There was a Problem' msg='The email address is invalid please enter the right email' /> 
      : vendorError.business === 'auth/network-request-failed'   ?  <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' /> 
      : vendorError.business === 'auth/email-already-in-use'   ?  <ErrorBox color='red' heading='There was a Problem' msg='This email address is already in use please try another email or login' /> 
      : vendorError.business === 'signIn' ? <ErrorBox color='green' heading='Sign Up Successful' msg='you are successfully registered to the site' />
      : vendorError.business === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
      : vendorLoading ? <div className='loading_icon'><AiOutlineLoading size='30px' /></div> : <></> }

    <div className="auth_main">
      <div className="auth_second_main">
      
     
        <div className="auth_box" style={{border : 'none'}}>

        

          <div className="auth_heading_div">
            <h1 className='Vendor_details_heading'>Enter your Business name and your business Details</h1>
          </div>
          <div className="auth_input_section">
              <form className="auth_input_section" action="" onSubmit={vendorBusinessDetails}> 
              <label htmlFor="auth_fname" className='auth_label'>Business name</label>
              <input type="text" id='auth_fname' className='auth_input'  value={vendor.bName} style={vendorInputError.bName? errorStyle : style} onChange={(e)=>dispatch({type : 'VENDOR_BNAME' , payload : e.target.value})} />

              <label htmlFor="auth_fname" className='auth_label'>Business Description</label>
              <input type="text" id='auth_lname' className='auth_input' value={vendor.bDescription} style={vendorInputError.bDescription? errorStyle : style}  onChange={(e)=>dispatch({type : 'VENDOR_BDESCRIPTION' , payload : e.target.value})} />

          
              <label htmlFor="auth_email" className='auth_label'>City</label>
              <input type="text" id='auth_email' className='auth_input' value={vendor.city} style={vendorInputError.city? errorStyle : style}  onChange={(e)=>dispatch({type : 'VENDOR_CITY' , payload : e.target.value})} />

            
              <label htmlFor="auth_password"  className='auth_label'>Country</label>
              <input type="text" id='auth_password' className='auth_input' value={vendor.country} style={vendorInputError.country? errorStyle : style}   onChange={(e)=>dispatch({type : 'VENDOR_COUNTRY' , payload : e.target.value})} />

              <label htmlFor="vendor_phone"  className='auth_label'>Address</label>
              <input type="text" id='vendor_phone' className='auth_input' value={vendor.address} style={vendorInputError.address? errorStyle : style}   onChange={(e)=>dispatch({type : 'VENDOR_ADDRESS' , payload : e.target.value})} />
    
            <div className="auth_submit_button">
              <button type='submit' className='auth_sign_up_button'>Create business Account</button>
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

export default VendorBusinessDetails