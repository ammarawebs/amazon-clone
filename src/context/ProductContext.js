import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import reducer from '../reducer/ProductReducer';
import { auth ,db } from "../config/firebase-config";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut, GoogleAuthProvider , signInWithPopup,  } from "firebase/auth";
import {addDoc ,collection , query, where, getDocs, updateDoc} from 'firebase/firestore'




const AppContext = createContext()

const API = 'https://fakestoreapi.com/products'

const initialState ={
    isLoading : false, 
    isError: false, 
    products : [],
    isSinlgleLoading: false,
    singleProduct: {}, 
    cartItem : [],
    isCart : false,
    totalQuantity : 0,
    totalPrice:0,
    users:[],
    registerUser: {
        firstname: '',
        lastname: '',
        email:'',
        password: '',
        role : 'buyer'
    },
    loginUser: {
        email: '',
        password: ''
    },
    currentUser : '',
    vendor: {
        id : '',
        firstname : '',
        lastname : '',
        email : '',
        password: '',
        phone: '',
        bName: '',
        bDescription: '',
        role : 'seller',
        city : '',
        country : '',
        address : '',
    },
    vendorError : {
        main : '',
        email : '',
        details : '',
        business : ''
    },
    vendorInputError : {
        fname : false,
        lname : false,
        email : false,
        password: false,
        phone: false,
        bName: false,
        bDescription: false,
        city : false ,
        country : false, 
        address : false,
    },
    vendorLoading : false,
    venderSection:'vendor-email',
    loginError : '',
    loginLoading : false,
    registerError : '',
    googleError : '',
    registerLoading : false,
    inputFieldError : {
        fname : false,
        lname : false, 
        email: false,
        password : false,

    }, 
    loginInputError : {
        email : false, 
        password : false,
    },
}




const  AppProvider = ({children}) => {
   
    

    const [state , dispatch] = useReducer(reducer , initialState)
    const cUser = useRef('')

    const usersCollectionRef = collection(db, 'users')
    const googleProvider = new GoogleAuthProvider




    const vendorBusinessDetails =async()=>{

        if(auth?.currentUser?.email !== undefined){
            if(state.vendor.bName ==='' || state.vendor.bDescription === '' || state.vendor.city ==='' || state.vendor.country === '' || state.vendor.address === '' ){
            
                dispatch({type : 'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS', payload : 'empty-fields'})
    
                if(state.vendor.bName ===''){
                    dispatch({type : 'VENDOR_BNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.bDescription ===''){
                    dispatch({type : 'VENDOR_BDESCRIPTION_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.city === ''){
                    dispatch({type : 'VENDOR_CITY_INPUT_ERROR_TRUE' })
                } 
                if(state.vendor.country === ''){
                    dispatch({type : 'VENDOR_COUNTRY_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.address === ''){
                    dispatch({type : 'VENDOR_ADDRESS_INPUT_ERROR_TRUE'})
                }
    
            }
            else{
                dispatch({type:'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS_RESOLVE'})
                if(state.vendor.firstname ==='' || state.vendor.lastname === ''  || state.vendor.phone === ''){
                    dispatch({type : 'PLEASE_FILL_THE_PREVIOUS_VENDOR_FORMS' , payload : 'empty-fields'})
                    if(state.vendor.firstname ===''){
                        dispatch({type : 'VENDOR_FNAME_INPUT_ERROR_TRUE'})
                    }
                    if(state.vendor.lastname ===''){
                        dispatch({type : 'VENDOR_LNAME_INPUT_ERROR_TRUE'})
                    }
                    if(state.vendor.phone === ''){
                        dispatch({type : 'VENDOR_PHONE_INPUT_ERROR_TRUE'})
                    }
    
                }
                else{
    
                    dispatch({type: 'VENDOR_INPUT_ERRORS_SOLVE'})
                    dispatch({type : 'VENDOR_LOADING_TRUE'})
                    try {
            
                        const q = query(usersCollectionRef, where('email', '==', auth.currentUser.email));
                        const querySnapshot = await getDocs(q);
                    
                        if (!querySnapshot.empty) {
                          // Assuming there's only one document with this email, you can access it like this
                          const userDoc = querySnapshot.docs[0];
                    
                          // Update the document data
                          await updateDoc(userDoc.ref, {
                            // Your new data here
                            // For example, to update a field called 'name':
                                
                                firstname : state.vendor.firstname,
                                lastname : state.vendor.lastname,
                                phone: state.vendor.phone,
                                bName:state.vendor.bName,
                                bDescription: state.vendor.bDescription,
                                role : 'seller',
                                city : state.vendor.city,
                                country :state.vendor.country,
                                address : state.vendor.address,
                            // Add other fields you want to update
                          });

                          dispatch({type : 'VENDOR_REGISTER_SUCCESS' , payload : 'signIn' })
                          dispatch({type : 'VENDOR_REGISTER_USER' , payload : 'vendor-register'})
                          showCurrentUser()
                          dispatch({type : 'VENDOR_EMPTY_REGISTER_FORM' })      
                          dispatch({type : 'REGISTER_NO_ERROR' })
                        }
            
                        
                        
                        
                    } catch (error) {

                        console.log(error)
                        if(error.code === 'auth/email-already-in-use'){
                            console.log('email already in use')
                            dispatch({type: 'VENDOR_EMAIL_ALREADY_ERROR' , payload: error.code})
                        }
                        else if(error.code === 'auth/invalid-email'){
                            console.log('email invalid')
                            dispatch({type: 'VENDOR_REGISTER_INVALID' , payload : error.code })
                        }
                        else if(error.code === 'auth/network-request-failed'){
                            dispatch({type : 'VENDOR_NETWORK_REQUEST_FAILED' , payload : error.code})
            
                        }
                        
                        
                    }
                    
                }
            }
            

        }
        else{

            if(state.vendor.bName ==='' || state.vendor.bDescription === '' || state.vendor.city ==='' || state.vendor.country === '' || state.vendor.address === '' ){
            
                dispatch({type : 'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS', payload : 'empty-fields'})
    
                if(state.vendor.bName ===''){
                    dispatch({type : 'VENDOR_BNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.bDescription ===''){
                    dispatch({type : 'VENDOR_BDESCRIPTION_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.city === ''){
                    dispatch({type : 'VENDOR_CITY_INPUT_ERROR_TRUE' })
                } 
                if(state.vendor.country === ''){
                    dispatch({type : 'VENDOR_COUNTRY_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.address === ''){
                    dispatch({type : 'VENDOR_ADDRESS_INPUT_ERROR_TRUE'})
                }
    
            }
            else{
                dispatch({type:'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS_RESOLVE'})
                if(state.vendor.firstname ==='' || state.vendor.lastname === '' || state.vendor.email ==='' || state.vendor.password === '' || state.vendor.phone === ''){
                    dispatch({type : 'PLEASE_FILL_THE_PREVIOUS_VENDOR_FORMS' , payload : 'empty-fields'})
                    if(state.vendor.firstname ===''){
                        dispatch({type : 'VENDOR_FNAME_INPUT_ERROR_TRUE'})
                    }
                    if(state.vendor.lastname ===''){
                        dispatch({type : 'VENDOR_LNAME_INPUT_ERROR_TRUE'})
                    }
                    if(state.vendor.email === ''){
                        dispatch({type : 'VENDOR_EMAIL_INPUT_ERROR_TRUE' })
                    } 
                    if(state.vendor.password === ''){
                        dispatch({type : 'VENDOR_PASSWORD_INPUT_ERROR_TRUE'})
                    }
                    if(state.vendor.phone === ''){
                        dispatch({type : 'VENDOR_PHONE_INPUT_ERROR_TRUE'})
                    }
    
                }
                else{
    
                    dispatch({type: 'VENDOR_INPUT_ERRORS_SOLVE'})
                    dispatch({type : 'VENDOR_LOADING_TRUE'})
                    try {
            
                        
                        const user = await createUserWithEmailAndPassword(
                            auth,
                            state.vendor.email,
                            state.vendor.password
                          );
            
                          
             
            
                        if (user.operationType === 'signIn') {
                            console.log('User successfully registered:', user.user.email);
                            dispatch({type : 'VENDOR_REGISTER_SUCCESS' , payload : user.operationType })
    
                            const vendorUser = {
    
                                id : user.user.uid,
                                firstname : state.vendor.firstname,
                                lastname : state.vendor.lastname,
                                email : user.user.email,
                                password: state.vendor.password,
                                phone: state.vendor.phone,
                                bName:state.vendor.bName,
                                bDescription: state.vendor.bDescription,
                                role : 'seller',
                                city : state.vendor.city,
                                country :state.vendor.country,
                                address : state.vendor.address,
    
                            }
    
                            dispatch({type : 'VENDOR_REGISTER_USER' , payload : 'vendor-register'})
                            showCurrentUser()
                            await addDoc(usersCollectionRef, vendorUser);
                            dispatch({type : 'VENDOR_EMPTY_REGISTER_FORM' })      
                            dispatch({type : 'REGISTER_NO_ERROR' })
            
                        }
                        
            
                        
                        
                        
                    } catch (error) {
                        console.log(error)
                        if(error.code === 'auth/email-already-in-use'){
                            console.log('email already in use')
                            dispatch({type: 'VENDOR_EMAIL_ALREADY_ERROR' , payload: error.code})
                        }
                        else if(error.code === 'auth/invalid-email'){
                            console.log('email invalid')
                            dispatch({type: 'VENDOR_REGISTER_INVALID' , payload : error.code })
                        }
                        else if(error.code === 'auth/network-request-failed'){
                            dispatch({type : 'VENDOR_NETWORK_REQUEST_FAILED' , payload : error.code})
            
                        }
            
                        
                    }
                    
                }
            }
            

        }

        
    }


    const vendorDetails = async()=>{
        if (auth?.currentUser?.email !== undefined){

            if(state.vendor.firstname ==='' || state.vendor.lastname === '' || state.vendor.phone === '' ){
                dispatch({type: 'EMPTY_VENDOR_DETAILS_FIELDS', payload : 'empty-fields' })
                if(state.vendor.firstname ===''){
                    dispatch({type : 'VENDOR_FNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.lastname ===''){
                    dispatch({type : 'VENDOR_LNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.phone === ''){
                    dispatch({type : 'VENDOR_PHONE_INPUT_ERROR_TRUE'})
                }
            }
            else{
                dispatch({type : 'EMPTY_VENDOR_DETAILS_FIELDS_RESOLVE' , payload : 'business-details'  })
    
                
    
    
            }

        }
        else{

            if(state.vendor.firstname ==='' || state.vendor.lastname === '' || state.vendor.email ==='' || state.vendor.password === '' || state.vendor.phone === '' ){
                dispatch({type: 'EMPTY_VENDOR_DETAILS_FIELDS', payload : 'empty-fields' })
                if(state.vendor.firstname ===''){
                    dispatch({type : 'VENDOR_FNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.lastname ===''){
                    dispatch({type : 'VENDOR_LNAME_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.email === ''){
                    dispatch({type : 'VENDOR_EMAIL_INPUT_ERROR_TRUE' })
                } 
                if(state.vendor.password === ''){
                    dispatch({type : 'VENDOR_PASSWORD_INPUT_ERROR_TRUE'})
                }
                if(state.vendor.phone === ''){
                    dispatch({type : 'VENDOR_PHONE_INPUT_ERROR_TRUE'})
                }
            }
            else{
                dispatch({type : 'EMPTY_VENDOR_DETAILS_FIELDS_RESOLVE' , payload : 'business-details'  })
    
                
    
    
            }
        }
        
        


    }

    
    const vendorEmail = async()=>{
        

        if (auth?.currentUser?.email !== undefined) {

            

            dispatch({type: 'CHANGE_VENDOR_FORM_STATE' , payload : 'personal-details'})




            // const q = query(usersCollectionRef, where('email', '==', auth.currentUser.email));
            // const querySnapshot = await getDocs(q);
        
            // if (!querySnapshot.empty) {
            //   // Assuming there's only one document with this email, you can access it like this
            //   const userDoc = querySnapshot.docs[0];
        
            //   // Update the document data
            //   await updateDoc(userDoc.ref, {
            //     // Your new data here
            //     // For example, to update a field called 'name':
            //     name: 'New Name',
            //     // Add other fields you want to update
            //   });
            // }
        }
        else{
            
            if(state.vendor.email === ''){
                dispatch({type : 'VENDOR_EMAIL_EMPTY' , payload : 'empty-fields'})
            }
            else{

                dispatch({type : 'ENABLE_VENDOR_LOADING'})            
                const q = query(usersCollectionRef, where('email', '==', state.vendor.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty){
                    console.log('email already Exist')
                    dispatch({type: 'VENDOR_EMAIL_ALREADY_EXIST' , payload : 'auth/email-already-in-use'})
                }
                else{
                dispatch({type: 'FORWARD_VENDOR_FORM_STATE' , payload : 'personal-details'})
            
            }
            }

            
            
        }
        
        
    }   



    const showCurrentUser = ()=>{
        console.log('current user : ', auth?.currentUser?.email)

    
    if(auth?.currentUser?.email !== undefined){
        console.log('yes its working')
        cUser.current = auth?.currentUser?.email
        // dispatch({type : 'CURRENT_USER' , payload : 'hello'})
    }
    else{
        cUser.current = null
        console.log('cUser: ',  cUser.current)
    }
        
    }


    showCurrentUser()

    
    
    const signUpWithGoogle = async()=>{

        if(auth?.currentUser?.email !== undefined){
            // console.log('WHAT THE FUCK')

            dispatch({type : 'PLEASE_LOG_OUT_FIRST_GOOGLE' })

        }
        else{

            dispatch({type : 'PLEASE_LOG_OUT_FiRST_GOOGLE_RESOLVE'})
            try {
                const result = await signInWithPopup(auth, googleProvider);
        
                // Access user information
                const user = result.user;
               
                console.log(user)
        
                const name = user.displayName;
                const email = user.email;
                const uid = user.uid;
        
                // Check if the user already exists in your database
        
                const q = query(usersCollectionRef, where('email', '==', email));
                const querySnapshot = await getDocs(q);
        
                if (!querySnapshot.empty) {
                // Email already exists in the collection
                console.log('Email already exists in the collection.');
                // Handle the case where the email is already registered, e.g., show an error message.
                dispatch({ type: 'GOOGLE_SIGN_UP', payload: 'google new sign up' });
                return; // Exit the function to prevent adding duplicate users.
        
                }
          
        
           
              // User is not already signed up with Google, so we can proceed to add them to the database
        
              const googleUser = {
                id: uid,
                firstname: name,
                lastname: '',
                email: email,
                role: 'buyer',
              };
        
              
        
            
              await addDoc(usersCollectionRef, googleUser);
              dispatch({ type: 'GOOGLE_SIGN_UP', payload: 'google new sign up ' });
        
               } catch (error) {
                if (error.code === 'auth/internal-error') {
                    console.log(error.code)
                    dispatch({type : 'NETWORK_ERROR'})
                }   

                console.log(error)
               }

        }
        

       
    }


    

    
    
        const logOut = async()=>{
            signOut(auth)
            dispatch({type : 'LOGOUT_USER' , payload : 'logout'})
            showCurrentUser()
        }

        const loginTheUser = async(event)=>{
            event.preventDefault()

            if(state.loginUser.email === '' || state.loginUser.password === '' ){

                dispatch({type : 'PLEASE_FILL_LOGIN'})

                if(state.loginUser.email === ''){
                    dispatch({type : 'LOGIN_EMAIL_EMPTY'})
                }
                if(state.loginUser.password === ''){
                    dispatch({type : 'LOGIN_PASSWORD_EMPTY'})
                }
                    

            }
            else{
                if(auth?.currentUser?.email !== undefined){


                    dispatch({type : 'PLEASE_LOG_OUT_FIRST_LOGIN' })

                }
                else{
                    dispatch({type : 'PLEASE_LOG_OUT_FIRST_LOGIN_RESOLVE' })
                    dispatch({type : 'LOGIN_ERRORS_SOLVE'})
                dispatch({type : 'LOGIN_LOADING'})
                 try {
                const user = await signInWithEmailAndPassword(auth , state.loginUser.email , state.loginUser.password)
                console.log(user)
                dispatch({type : 'LOGIN_USER' , payload : 'login'})
                showCurrentUser()
                if(user.operationType === 'signIn'){
                    dispatch({type : 'USER_FOUND' , payload : user.operationType  })  
                }
                              
                
                
                
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    // Handle the case when user is not found
                    console.log('User not found.');
                    // You can perform additional actions specific to this error
                    dispatch({type : 'USER_NOT_FOUND' , payload : error.code })
                } 
                else if(error.code === 'auth/wrong-password'){
                    dispatch({type : 'WRONG_PASSWORD' , payload : error.code})
                    console.log(error);
                    // Handle other errors
                }
                else if(error.code === 'auth/invalid-email'){
                    dispatch({type : 'INVALID_EMAIL' , payload : error.code})
                    console.log(error);
                    // Handle other errors
                }
                else if(error.code === 'auth/network-request-failed'){
                    dispatch({type : 'NETOWRK_ERROR' , payload :error.code })
                }
                else{
                    console.log(error)
                }
            }
                }
                

            }

            
        }
        
    const createUser = async(event)=>{
        event.preventDefault()



            if(state.registerUser.firstname === '' || state.registerUser.lastname === '' || state.registerUser.email === '' || state.registerUser.password === ''){

        dispatch({type : 'PLEASE_FILL'})

        if(state.registerUser.firstname === ''){
            dispatch({type : 'INPUT_FNAME_ERROR'})
        }
        if(state.registerUser.lastname === ''){
            dispatch({type : 'INPUT_LNAME_ERROR'})
        }
        if(state.registerUser.email === ''){
            dispatch({type : 'INPUT_EMAIL_ERROR'})
        }
        if(state.registerUser.password === ''){
            dispatch({type : 'INPUT_PASS_ERROR'})
        }

        }
        else{
        if(auth?.currentUser?.email !== undefined){
            dispatch({type: 'PLEASE_LOG_OUT_FIRST_REGISTER'})
        }
        else{
            dispatch({type: 'PLEASE_LOG_OUT_FIRST_REGISTER_RESOLVE'})

            dispatch({type: 'INPUT_ERRORS_SOLVE'})
        dispatch({type : 'REGISTER_LOADING_TRUE'})
        try {

            
            const user = await createUserWithEmailAndPassword(
                auth,
                state.registerUser.email,
                state.registerUser.password
              );

              
 

            if (user.operationType === 'signIn') {
                console.log('User successfully registered:', user.user.email ,  user.user.uid);
                dispatch({type : 'REGISTER_SUCCESS' , payload : user.operationType })
                const createRegisterUser = {
                    id:user.user.uid,
                    firstname: state.registerUser.firstname,
                    lastname: state.registerUser.lastname,
                    email: user.user.email,
                    password : state.registerUser.password,
                    role: 'buyer',
                  };
    
                
                dispatch({type : 'REGISTER_USER' , payload : 'register'})
                showCurrentUser()
                await addDoc(usersCollectionRef, createRegisterUser);
                dispatch({type : 'EMPTY_REGISTER_FORM' })      
                dispatch({type : 'REGISTER_NO_ERROR' })

            }
            

            
            
        } catch (error) {
            console.log(error)
            if(error.code === 'auth/email-already-in-use'){
                console.log('email already in use')
                dispatch({type: 'REGISTER_ERROR' , payload: error.code})
            }
            else if(error.code === 'auth/invalid-email'){
                console.log('email invalid')
                dispatch({type: 'REGISTER_INVALID' , payload : error.code })
            }
            else if(error.code === 'auth/network-request-failed'){
                dispatch({type : 'NETWORK_REQUEST_FAILED' , payload : error.code})

            }

            
        }

        }
            
        
        
    }
    }


    
    


    const addProduct = async()=>{

    }

    // all products api call

    const getProducts = async(url) =>{

        dispatch({type : 'SET_API_LOADING'})

       try {
         const res = await axios.get(url)
         const getProductsData = await res.data
         dispatch({type: 'SET_API_DATA' , payload : getProductsData})
       } catch (error) {
        dispatch({type : 'SET_API_ERROR'})
       }

    }


    //single product api call 

    const  getSingleProduct = async(url)=>{
        dispatch({type : 'SET_SINGLE_LOADING'})
        try {

            const res = await axios.get(url);
            const singleProduct =  res.data
            dispatch({type: 'SET_SINGLE_PRODUCT' , payload : singleProduct})
            
        } catch (error) {
            dispatch({type : 'SET_SINGLE_ERROR'})
        }


    }

    const GetTotalQuantityPrice = ()=>{
        dispatch({type : 'TOTAL_QUANTITY_PRICE'})

        console.log(state.totalPrice)
        console.log(state.totalQuantity)
    }

    const GettingCartItem = (item)=>{

        dispatch({type: 'GETTING_CART_ITEM' , payload : item})

        GetTotalQuantityPrice()

      

        console.log(state.cartItem)

        
    }

    const cartHandling = ()=>{
        dispatch({type : 'CART_HANDLING'})
    }

    const cartItemIncreament = (item , product) =>{
        dispatch({type : 'CART_ITEM_INCREAMENT' , payload: {
            item: item,
            product: product
        }})


        GetTotalQuantityPrice()
    }
    const cartItemDecreament = (item , product) =>{
        dispatch({type : 'CART_ITEM_DECREAMENT' , payload: {
            item: item,
            product: product
        }})


        GetTotalQuantityPrice()
    }

    

    

    useEffect(()=>{
        getProducts(API);
        

    },[state.currentUser ])

    return <AppContext.Provider value={{...state, getSingleProduct , GettingCartItem, cartHandling ,cartItemIncreament ,cartItemDecreament ,dispatch , createUser , loginTheUser , cUser , logOut, signUpWithGoogle ,addDoc , usersCollectionRef, vendorEmail, vendorDetails , vendorBusinessDetails}}>{children}</AppContext.Provider>
}

// custom hook

const useProductContext = () =>{
    return useContext(AppContext)

}
 
export {AppProvider, AppContext , useProductContext}