import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';

import { useProductContext } from '../context/ProductContext';
import ErrorBox from './ErrorBox';
import Loader from './Loader';


const Auth = () => {
  

  const {dispatch , createUser , registerUser , registerError, registerLoading, inputFieldError , signUpWithGoogle, googleError } = useProductContext()


  
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
      <div className="auth_main"  style={{marginTop: '100px'}}>
        <div className="auth_second_main">
        { registerError === 'empty-fields'   ?  <ErrorBox color='red' heading='There was a Problem' msg='some input fields are empty please fill them' /> 
        : registerError === 'auth/invalid-email'   ?  <ErrorBox color='red' heading='There was a Problem' msg='The email address is invalid please enter the right email' /> 
        : registerError === 'auth/network-request-failed'   ?  <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' /> 
        : registerError === 'auth/email-already-in-use'   ?  <ErrorBox color='red' heading='There was a Problem' msg='This email address is already in use please try another email' /> 
        : registerError === 'signIn' ? <ErrorBox color='green' heading='Sign Up Successful' msg='you are successfully registered to the site' />
        : registerError === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
        : googleError === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
        : googleError === 'network-error' ? <ErrorBox color='red' heading='Network problem' msg='Sorry there are some network Issues' />
        : registerLoading ? <Loader/> : <></> }
       
          <div className="auth_box">
            <div className="auth_heading_div">
              <h1 className='auth_heading'>Sign up</h1>
            </div>
            <div className="auth_input_section">
                <form className="auth_input_section" action="" onSubmit={createUser}> 
                <label htmlFor="auth_fname" className='auth_label'>first name</label>
                <input type="text" id='auth_fname' className='auth_input'  value={registerUser.firstname} style={inputFieldError.fname? errorStyle : style} onChange={(e)=>dispatch({type : 'REGISTER_FNAME' , payload : e.target.value})} />

                <label htmlFor="auth_fname" className='auth_label'>Last name</label>
                <input type="text" id='auth_lname' className='auth_input' value={registerUser.lastname} style={inputFieldError.lname? errorStyle : style}  onChange={(e)=>dispatch({type : 'REGISTER_LNAME' , payload : e.target.value})} />

            
                <label htmlFor="auth_email" className='auth_label'>email</label>
                <input type="email" id='auth_email' className='auth_input' value={registerUser.email} style={inputFieldError.email? errorStyle : style}  onChange={(e)=>dispatch({type : 'REGISTER_EMAIL' , payload : e.target.value})} />

              
                <label htmlFor="auth_password"  className='auth_label'>password</label>
                <input type="password" id='auth_password' className='auth_input' value={registerUser.password} style={inputFieldError.password? errorStyle : style}   onChange={(e)=>dispatch({type : 'REGISTER_PASSWORD' , payload : e.target.value})} />
      
              <div className="auth_submit_button">
                <button type='submit' className='auth_sign_up_button'>Sign Up</button>
              </div>
              </form>
              <div className="auth_signup_google">
                <button className='auth_sign_up_google' onClick={signUpWithGoogle}><FcGoogle  size='20'/>&nbsp;  Sign up with Google</button>
              </div>
              <p className='auth_agree'>By creating an account, you agree to our Conditions of Use and Privacy Notice.</p>
              <div className='auth_divider'>
                <div className='auth_divider_inner'>

                </div>
              </div>
              <p className='auth_buying_for_work'><b>Buying for work?</b><Link to='/become-a-seller'>create a free business account </Link></p>
              <div className='auth_divider'>
                <div className='auth_divider_inner'>

                </div>
              </div>
              
              <p className='auth_sign_in'>already have an account?<br/><Link to='/log-in'>sign in</Link></p>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth