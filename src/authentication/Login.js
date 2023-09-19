import React from 'react'
import { Link } from 'react-router-dom';
import { TfiAlert } from "react-icons/tfi";
import ErrorBox from './ErrorBox';
import { AiOutlineLoading } from "react-icons/ai";
import { useProductContext } from '../context/ProductContext';
import { FcGoogle } from "react-icons/fc";
import Button from './Button';
import Link_text from './Link_text';


const Login = () => {

    const {dispatch , loginTheUser ,currentUser , loginError,  loginLoading, loginInputError, loginUser ,signUpWithGoogle, googleError} = useProductContext()

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
      <div className="auth_main" style={{marginTop: '100px'}}>
        <div className="auth_second_main">
        {loginError == 'auth/user-not-found' ? <ErrorBox color='red' heading='There was a Problem' msg='The email address is not registered with us' />
        : loginError == 'auth/wrong-password' ? <ErrorBox color='red' heading='There was a Problem' msg='you entered a wrong password' />
        : loginError == 'signIn' ? <ErrorBox color='green' heading='Login Successful' msg='you are now logged in' />
        : loginError == 'auth/invalid-email' ? <ErrorBox color='red' heading='There was a Problem' msg='The Email you entered is invalid ' />
        : loginError == 'empty-fields' ? <ErrorBox color='red' heading='There was a Problem' msg='Some Fields were empty please fill them' />
        : loginError == 'someone-logged-in' ? <ErrorBox color='red' heading='There was a Problem' msg='Some user already logged in please log out first' />
        : loginError == 'auth/network-request-failed' ? <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' />
        : loginError == 'deleted' ? <ErrorBox color='red' heading='There was a problem' msg='Sorry this account is no longer available' />
        : googleError === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' />
        : googleError === 'network-error' ? <ErrorBox color='red' heading='Network problem' msg='Sorry there are some network Issues' />  
        : loginLoading == true ?  <div className='loading_icon'><AiOutlineLoading size='30px' /></div> : <></> }
        
          <div className="auth_box">
            <div className="auth_heading_div">
              <h1 className='auth_heading'>Log In</h1>
            </div>
            <div className="auth_input_section">
              <form className="auth_input_section" action="" onSubmit={loginTheUser}>
              
                <label htmlFor="auth_email" className='auth_label'>email</label>
                <input type="email" id='auth_email' className='auth_input' style={loginInputError.email? errorStyle : style  } value={loginUser.email} onChange={(e)=>dispatch({type : 'LOGIN_EMAIL' , payload : e.target.value})} />

              
                <label htmlFor="auth_password"  className='auth_label'>password</label>
                <input type="password" id='auth_password' className='auth_input' style={loginInputError.password? errorStyle : style  } value={loginUser.password} onChange={(e)=>dispatch({type : 'LOGIN_PASSWORD' , payload : e.target.value})}/>
      
              <div className="auth_submit_button">
                
                <Button type='submit' title='Log In'/>
              </div>
              
              </form>
              <div className="auth_signup_google">
                <button className='auth_sign_up_google' onClick={signUpWithGoogle}><FcGoogle  size='20'/>&nbsp;  Sign up with Google</button>
                
              </div>
              
              <Link_text title='By creating an account, you agree to our Conditions of Use and Privacy Notice.' />
              
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login