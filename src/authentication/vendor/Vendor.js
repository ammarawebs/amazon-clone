import React from 'react'
import VendorCount from './VendorCount'
import VendorEmail from './vendorEmail/VendorEmail'
import VendorDetails from './VendorDetails';
import VendorBusinessDetails from './VendorBusinessDetails';
import { useProductContext } from '../../context/ProductContext';
import { AiOutlineLoading } from "react-icons/ai";
import ErrorBox from '../ErrorBox';



const Vendor = () => {

    const {venderSection , dispatch ,vendorError ,vendorLoading  } = useProductContext()

    const style = {
        backgroundColor : 'white',
        color : 'black'
    }

    const blueStyle = {
        backgroundColor : '#001f3c',
        color : 'white'
    }



  return (
    <>

        <div className="vendor">

        { vendorError.main === 'empty-fields'   ?  <ErrorBox color='red' heading='There was a Problem' msg='Some input fields from the previous forms are empty please fill them' /> 
            : vendorError.main === 'auth/invalid-email'   ?  <ErrorBox color='red' heading='There was a Problem' msg='The email address is invalid please enter the right email' /> 
            : vendorError.main === 'auth/network-request-failed'   ?  <ErrorBox color='red' heading='Request Failed' msg='Sorry there are some Network Issues' /> 
            : vendorError.main === 'auth/email-already-in-use'   ?  <ErrorBox color='red' heading='There was a Problem' msg='This email address is already in use please try another email or login' /> 
            : vendorError.main === 'signIn' ? <ErrorBox color='green' heading='Sign Up Successful' msg='you are successfully registered to the site' />
            : vendorError.main === 'someone-logged-in' ? <ErrorBox color='red' heading='There was a problem' msg='Some User already Logged in Please logged out first' /> 
            : <></> }

            <div className="vendorMain">
                <VendorCount count='1' title='Enter Business Email'  dispatchMethod = 'MAKE_VENDOR_EMAIL' style = { venderSection==='vendor-email'? blueStyle : style } />
                <VendorCount count='2' title='Enter Your Personal Details'  dispatchMethod = 'MAKE_PERSONAL_DETAILS' style = { venderSection==='personal-details'? blueStyle : style }/>
                <VendorCount count='3' title='Enter Business Details'  dispatchMethod = 'MAKE_BUSINESS_DETAILS' style = { venderSection==='business-details'? blueStyle : style }/>
            </div>
            
            
        
            {

                venderSection==='vendor-email' ? <VendorEmail/>
                :venderSection==='personal-details'? <VendorDetails/> 
                :venderSection ==='business-details'? <VendorBusinessDetails/>
                :<></>
             }
            

        </div>
    </>
  )
}

export default Vendor