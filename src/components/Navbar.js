import React, { useEffect, useReducer } from 'react'
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useProductContext } from '../context/ProductContext';
import { BsSearch } from "react-icons/bs";
import { TfiUser } from "react-icons/tfi";
import Button from '../authentication/Button';
import Link_text from '../authentication/Link_text';
import { auth ,db } from "../config/firebase-config";
import Logo from './Logo';






const Navbar = () => {

const { isCart, cartHandling, totalQuantity , cUser ,logOut , location, dispatch, signInDropdown, user, showSellerAccount , navbar, showAdminAccount , showCustomerAccount, localCartTotalQuantity} = useProductContext()




useEffect(()=>{
  

},[])






  return (
    <>
    <div className='header_main'>
        <div className="header_second_main">
            
            <Logo/>

            <div className='header_location_selecton'>
            <CiLocationOn size='25px'/>
            <div className="loaction_deliver">
              <p className='deliver_to'>Deliver to</p>
              <p className='location_country'><span>{location.city} </span><span>{location.country}</span></p>
            </div>
            </div>

            <div className="header_search_bar">
                <select name="header-category" id="header-category" className='header_category_selector'>
                <option className='selector_option' value="All">All</option>
                <option className='selector_option' value="clothing">clothing</option>
                <option className='selector_option' value="electronics">electronics</option>
                <option className='selector_option' value="mobiles">mobiles</option>
                <option className='selector_option' value="furniture">furniture</option>
                
                </select>
                <input type="text"  placeholder='Search Amazon' className='SearchBar_input'/>
                <button className='searchbar_btn'><BsSearch size='22px'/></button>

            </div>

            <div className="language_feature">
              <div id="google_translate_element"></div>
            </div>
            <div className="sign_in_dropdown">
            <button className='header_signin_selecton'  onMouseEnter={()=>dispatch({type : 'SHOW_SIGN_IN_DROPDOWN'})}>

            {/*  */}
        
            <TfiUser size='20px' className='sigin_user'/>
            <div className="loaction_deliver">
              <p className='deliver_to'>Hello, {localStorage.getItem('userName')? localStorage.getItem('userName') : 'Sign In' }</p>
              <p className='location_country'>Accounts & Lists</p>
            </div>

         
            </button>
            {
              signInDropdown? 
              <div className="sign_in_dropdown_section" onMouseLeave={()=>dispatch({type : 'MAKE_SIGNUP_DROPDOWN_FALSE'})} >
                {auth?.currentUser ? <></> : <div className="sign_in_dropdown_btn_section">
                  <Link to='/log-in'><Button title='Sign In' width='300px'/></Link>
                  <div className="sign_in_dropdown_btn_text">
                  
                  <p>New Customer? &nbsp;</p><Link_text title='start here' link='/sign-up'/>
                  
                    
                  </div>
                  
                </div> }
                <hr className='hrSolid'/>
                <div className="sign_in_dropdown_link_section">
                  <div className="sign_in_dropdown_link_left">
                    
                    <h3>Your Account</h3>
                    
                    { localStorage.getItem('loginAccountPage') === 'customerAccount' ?<Link_text title='Customer Account'  padding='0px' margin='2px 0px' link='/user-dashboard' />:<></>}
                    { localStorage.getItem('loginAccountPage') === 'sellerAccount' ?<Link_text title='Seller Account'  padding='0px' margin='2px 0px' link='/seller-dashboard' />:<></>}
                    <Link_text title='Become a seller'  padding='0px' margin='2px 0px' link='/become-a-seller' />
                    { localStorage.getItem('loginAccountPage') === 'adminAccount' ?<Link_text title='admin account'  padding='0px' margin='2px 0px' link='/admin-dashboard' />:<></>}
                    {/* <a>{localStorage.getItem('loginAccountPage')}</a> */}
                    <br/>
                    {auth?.currentUser?.email !== undefined ? <button onClick={logOut}>Log Out</button> : <></> }
                    

                  </div>
                  <div className='vl'></div>
                  <div className="sign_in_dropdown_link_right">
                    <h3>Your Lists</h3>
                    
                  </div>
                  
                </div>
              </div>
              : <></>
            }

            
              

            </div>
            
            

            {/* <Link to='/become-a-seller' >
                <button>Become a Seller</button>
              </Link>
              <Link to='/admin-dashboard' >
                <button>Admin</button>
              </Link>
              <Link to='/user-dashboard' >
                <button>User</button>
              </Link>


              
              {cUser.current === null ? <>
                <Link to='/sign-up'>
                <button>sign up</button>
              </Link> 
              <Link to='/log-in'>
                <button>log in</button>
              </Link>
              
              </> : <>
              <h3>{cUser.current}</h3>
              
              <button onClick={logOut}>Log out</button>
              </>
              } */}
            <div className='cart'>
              
              
              <button  className='cart_btn' onClick={()=> {cartHandling()}}>
                <div className='cart_cart'>
                  <div className="cart_header_quantity"><p>{localCartTotalQuantity}</p></div>
                  <span  className='cart_icon' ></span>
                  
                </div>
                
                <p className='cart_name'>cart</p>
              </button>
              
              
              
              
              

              
            </div>
            
        </div>

        
    </div>

    { isCart ? <Sidebar /> : <></> }

    

        </>
  )
}

export default Navbar