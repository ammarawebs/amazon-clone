import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import reducer from '../reducer/ProductReducer';
import { auth ,db } from "../config/firebase-config";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut, GoogleAuthProvider , signInWithPopup,  } from "firebase/auth";
import {addDoc ,collection , query, where, getDocs, updateDoc, getDoc , doc} from 'firebase/firestore'
import {useNavigate} from 'react-router-dom'
import {loadStripe} from '@stripe/stripe-js'
import Link_text from "../authentication/Link_text";
const { createProductInStripe, createProductsInStripe, fetchStripeProducts, fetchStripeAllProducts, updateStripeProduct } = require('../Node/stripeIntegrations'); // Adjust the path as needed






const AppContext = createContext()

const API = 'https://fakestoreapi.com/products'

const geoLoactionApi = 'https://ipinfo.io/json?token=4509f330d8179a'



const initialState ={
    isLoading : false, 
    isError: false, 
    products : [],
    isSinlgleLoading: false,
    singleProduct: {
      title : '',
      category :'',
      description :'',
      image : '',
      price : '',
  
    }, 
    addSingleProduct : {
      id : 0,
      title: '', 
      category : '',
      description: '',
      image : '',
      price : '',
      status : 'active',
      rating: {
        count : 0,
        rate : 0,
      }
    },
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
    location:{
        country: '',
        city: '',
    },
    signInDropdown : false,
    user : {
        role : '',
        name : ''
    },
    userManagment : {
        customers : [],
        sellers : [], 
        deletedCustomers : [],
        deleteSellers : [],
        customersTableError : false ,
        sellersTableError : false,
        deletedCustomerError : false , 
        deletedSellersError : false,
        tempStates : {
            selectedCustomers:[],
            deletedCustomers :[],
            selectedSellers:[],
            deletedSellers:[],
        }
    },
    productManagement : {
      products : [],
      deletedProducts : [],
      productsTableError: false,
      deletedProductsTableError: false,
      tempStates: {
        selectedProducts : [],
        selectedDeletedProducts : []
      }
    },
    navbar : {
      sellerAccount : null,
      customerAccount : null,
      adminAccount: null,
    },
    localStorageCart : JSON.parse(localStorage.getItem("cart")) || [],
    localCartTotalQuantity : Number(localStorage.getItem('quantity')) || 0,
    localCartTotalPrice : Number(localStorage.getItem('price')) || 0,
    localUserEmail : localStorage.getItem('userEmail') || '',
    localOrderId : localStorage.getItem('orderId') || '',
    ordersDataRef : [],
    cancelOrdersDataRef : [],
  




}








const  AppProvider = ({children}) => {

  let navigate = useNavigate();
    
        
    const [state , dispatch] = useReducer(reducer , initialState)
    const cUser = useRef('')

    const usersCollectionRef = collection(db, 'users')
    const productsCollectionRef = collection(db, 'products');
    const ordersCollectionRef = collection(db, 'orders');
    
    const googleProvider = new GoogleAuthProvider

    const generateUniqueNumberId = () => {
      const timestamp = new Date().getTime(); // Get current timestamp in milliseconds
      const uniqueId = parseInt(`${timestamp}${Math.floor(Math.random() * 1000)}`, 10); // Append a random number
      return uniqueId;
    }

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };



    const getCancelOrdersDataforAdmin = async () => {
      
      try {
        const q = query(ordersCollectionRef, where('status', '==', 'cancel'));
        const ordersSnapshot = await getDocs(q);
    
        if (ordersSnapshot.empty) {
          console.log('No complete orders found.');
          return [];
        }
    
        const ordersData = [];
        ordersSnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
    
        dispatch({type: 'GET_CANCEL_ORDERS_DATA_FOR_ADMIN' , payload : ordersData })
      } catch (error) {
        console.error('Error fetching orders: ', error);
        throw error; // You can handle the error as needed
      }
    };



    const getOrdersDataforAdmin = async () => {
      
      try {
        const q = query(ordersCollectionRef, where('status', '==', 'complete'));
        const ordersSnapshot = await getDocs(q);
    
        if (ordersSnapshot.empty) {
          console.log('No complete orders found.');
          return [];
        }
    
        const ordersData = [];
        ordersSnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
    
        dispatch({type: 'GET_ORDERS_DATA_FOR_ADMIN' , payload : ordersData })
      } catch (error) {
        console.error('Error fetching orders: ', error);
        throw error; // You can handle the error as needed
      }
    };
    
    // Usage:
   
    
    


    const makeOrderCancel = async () => {
      try {
        const orderId = await state.localOrderId;
        
        // Query Firestore to find the order with the given orderId
        const q = query(ordersCollectionRef, where("orderId", "==", Number(orderId)));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // There is an order with the given orderId
          const orderDoc = querySnapshot.docs[0];
          const orderRef = doc(db, "orders", orderDoc.id);
    
          // Update the status from 'incomplete' to 'complete'
          await updateDoc(orderRef, { status: "cancel" });
    
          console.log("Order status updated to cancel");
        } else {
          console.log("No order found with orderId:", orderId);
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    };



    const makeOrderComplete = async () => {
      try {
        const orderId = await state.localOrderId;
        
        // Query Firestore to find the order with the given orderId
        const q = query(ordersCollectionRef, where("orderId", "==", Number(orderId)));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // There is an order with the given orderId
          const orderDoc = querySnapshot.docs[0];
          const orderRef = doc(db, "orders", orderDoc.id);
    
          // Update the status from 'incomplete' to 'complete'
          await updateDoc(orderRef, { status: "complete" });
    
          console.log("Order status updated to complete");
        } else {
          console.log("No order found with orderId:", orderId);
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    };

     
    const saveOrderDataToFireBase = async (orderId) => {
      // Cart Data
      const cartData = await state.localStorageCart;
      const totalBill = await state.localCartTotalPrice;
      const userEmail = await state.localUserEmail;
    
      // Fetch user data
      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(userQuery);
    
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
    
        // Get the current date and time
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const formattedTime = formatTime(currentDate);
    
        // Create an order object with the current date and time
        const orderData = {
          orderId: orderId,
          status: 'incomplete',
          date: formattedDate,
          time: formattedTime, // Add the current time
          cartData: cartData,
          totalBill: totalBill,
          userData: userData,
        };
    
        // Add the order data to the 'orders' collection
        await addDoc(ordersCollectionRef, orderData);
    
        console.log('Order data saved:', orderData);
      }
    };

    const showAdminAccount = async () => {
      if (auth?.currentUser) {
        const uid = auth.currentUser.uid;

        console.error('THOS OS THE UID' , uid)
    
        try {
          // Query Firestore to check if the user exists with 'buyer' role and the given UID
          const customerQuerySnapshot = await getDocs(
            query(usersCollectionRef, where('role', '==', 'admin'), where('id', '==', uid))
          );
    
          if (!customerQuerySnapshot.empty) {
            // User with 'buyer' role and the given UID exists, return the "Seller" div
            dispatch({type : 'MAKE_ADMIN_ACCOUNT_TRUE'})
          }
        } catch (error) {
          // Handle any errors that may occur during the Firestore query
          console.error('Error checking user role:', error);
        }
      }
      
      
      
    };

    const showSellerAccount = async () => {
      if (auth?.currentUser) {
        const uid = auth.currentUser.uid;
    
        try {
          // Query Firestore to check if the user exists with 'buyer' role and the given UID
          const customerQuerySnapshot = await getDocs(
            query(usersCollectionRef, where('role', '==', 'buyer'), where('id', '==', uid))
          );
    
          if (!customerQuerySnapshot.empty) {
            // User with 'buyer' role and the given UID exists, return the "Seller" div
            dispatch({type : 'MAKE_CUSTOMER_ACCOUNT_TRUE'})
          }
        } catch (error) {
          // Handle any errors that may occur during the Firestore query
          console.error('Error checking user role:', error);
        }
      }
      
      
      
    };


    const showCustomerAccount = async () => {
      if (auth?.currentUser) {
        const uid = auth.currentUser.uid;
    
        try {
          // Query Firestore to check if the user exists with 'buyer' role and the given UID
          const customerQuerySnapshot = await getDocs(
            query(usersCollectionRef, where('role', '==', 'seller') , where('id', '==', uid))
          );
    
          if (!customerQuerySnapshot.empty) {
            console.error('USER <<<<<', customerQuerySnapshot )
            // User with 'buyer' role and the given UID exists, return the "Seller" div
            dispatch({type : 'MAKE_SELLER_ACCOUNT_TRUE'})
          }
        } catch (error) {
          // Handle any errors that may occur during the Firestore query
          console.error('Error checking user role:', error);
        }
      }
      else{
        
      }
      
      
      
    };

    const addProductForAdmin = async () => {
      dispatch({ type: "SET_SINGLE_LOADING" });
      const uniqueId = generateUniqueNumberId();
    
      const productData = {
        id: uniqueId,
        title: state.addSingleProduct.title,
        category: state.addSingleProduct.category,
        description: state.addSingleProduct.description,
        image: state.addSingleProduct.image,
        price: state.addSingleProduct.price,
        status: 'active',
        rating: state.addSingleProduct.rating,
      };
    
      try {
        // Add the product to Firestore
        const docRef = await addDoc(productsCollectionRef, productData);
        console.log("Product added with ID: ", docRef.id);
        
        // Create the product in Stripe
        const stripeProductData = await createProductInStripe(productData);
    
        dispatch({ type: "SET_SINGLE_LOADING_FALSE" });
        dispatch({ type: 'SET_ADD_PRODUCT_EMPTY' });
        getProducts();
        return navigate('/admin-dashboard/product-management');
    
      } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
      }
    };
    
    


    const singleProductEdited = async (id) => {
      dispatch({ type: "SET_SINGLE_LOADING" });
      try {
        const numId = Number(id);
        const q = query(productsCollectionRef, where("id", "==", numId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;

          const updatedProduct = {
            title : state.singleProduct.title,
            category : state.singleProduct.category,
            description : state.singleProduct.description,
            price : state.singleProduct.price,
            image : state.singleProduct.image,
          }

          await updateDoc(docRef, updatedProduct);
          
          await updateStripeProduct(id , updatedProduct)

          


          dispatch({ type: "SET_SINGLE_LOADING_FALSE" });
          getProducts()
          return navigate('/admin-dashboard/product-management');
          
        } else {
          console.error("No matching document found.");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        dispatch({ type: "SET_SINGLE_ERROR" });
      }
    };
    

    const getProductsStatus = async ()=>{

      // let products = [] 

      try {
      //   const querySnapshot = await getDocs(productsCollectionRef);

        
        
      //   await querySnapshot.forEach((doc) => {
      //     // Access the data of each document and log it
      //     products.push(doc.data()) 
      //   });

      //   await createProductsInStripe(products)
      const products = await fetchStripeAllProducts();

        
        console.log('Status updated for all products.', products);
      } catch (error) {
        console.error('Error updating status:', error);
      }
  

    }

    const deleteDeletedProducts =async () =>{
      try {
        dispatch({type : 'PRODUCTS_DELETED_TABLE_ERROR_TRUE'})

        // Remove the deleted customers from the state
        const updatedProducts = state.productManagement.deletedProducts.filter(
          (deletedProduct) => !state.productManagement.tempStates.selectedDeletedProducts.includes(deletedProduct.id)
        );
        dispatch({ type: 'UPDATE_DELETED_PRODUCTS_BY_ADMIN', payload: updatedProducts });

        await Promise.all(
          state.productManagement.tempStates.selectedDeletedProducts.map(async (productId) => {
            const querySnapshot = await getDocs(
              query(productsCollectionRef, where('id', '==', productId))
            );
    
            if (!querySnapshot.empty) {
              // Get the first document (there should be only one if 'userId' is unique)
              const prodcuctDoc = querySnapshot.docs[0];
    
              // Delete the document from Firestore
              await updateDoc(prodcuctDoc.ref , {
                status : 'active',
              });
            }
          })
        );
        
        // Clear the selection
        dispatch({type : 'EMPTY_SELECTED_DELETED_PRODUCTS'})
        getAllProductsForAdmin()
        getAllDeletedProductsForAdmin()
        getProducts()
      } catch (error) {
        console.error('Error deleting customers:', error);
      }


    }


    const deleteSelectedProducts = async () =>{

      try {
        dispatch({type : 'PRODUCTS_TABLE_ERROR_TRUE'})

        // Remove the deleted customers from the state
        const updatedProducts = state.productManagement.products.filter(
          (product) => !state.productManagement.tempStates.selectedProducts.includes(product.id)
        );
        dispatch({ type: 'UPDATE_PRODUCTS_BY_ADMIN', payload: updatedProducts });

        await Promise.all(
          state.productManagement.tempStates.selectedProducts.map(async (productId) => {
            const querySnapshot = await getDocs(
              query(productsCollectionRef, where('id', '==', productId))
            );
    
            if (!querySnapshot.empty) {
              // Get the first document (there should be only one if 'userId' is unique)
              const prodcuctDoc = querySnapshot.docs[0];
    
              // Delete the document from Firestore
              await updateDoc(prodcuctDoc.ref , {
                status : 'deleted',
              });
            }
          })
        );
        
        // Clear the selection
        dispatch({type : 'EMPTY_SELECTED_PRODUCTS'})
        getAllProductsForAdmin()
        getAllDeletedProductsForAdmin()
        getProducts()
      } catch (error) {
        console.error('Error deleting customers:', error);
      }

    }

    const handleEditProductClick= async(id)=>{
      console.log(id)

    }

    const getAllDeletedProductsForAdmin = async () =>{
      dispatch({ type: 'PRODUCTS_DELETED_TABLE_ERROR_TRUE' });
    
      try {
        const querySnapshot = await getDocs(query(productsCollectionRef, where('status', '==', 'deleted')));
        const productsArray = [];
    
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          productsArray.push(productData);
        });
    
        dispatch({ type: 'GET_ALL_DELETED_PRODUCTS_FOR_ADMIN', payload: productsArray });
        dispatch({ type: 'PRODUCTS_DELETED_TABLE_ERROR_FALSE' });
      } catch (error) {
        console.error('Error getting products:', error);
      }

    }

    const getAllProductsForAdmin = async () => {
      dispatch({ type: 'PRODUCTS_TABLE_ERROR_TRUE' });
    
      try {
        const querySnapshot = await getDocs(query(productsCollectionRef, where('status', '==', 'active')));
        const productsArray = [];
    
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          productsArray.push(productData);
        });
    
        dispatch({ type: 'GET_ALL_PRODUCTS_FOR_ADMIN', payload: productsArray });
        dispatch({ type: 'PRODUCTS_TABLE_ERROR_FALSE' });
      } catch (error) {
        console.error('Error getting products:', error);
      }
    };
    
    


    const deleteDeletedSellers = async () => {
        try {
  
          dispatch({type : 'DELETED_SELLERS_TABLE_ERROR_TRUE' , payload: true})
          // Remove the deleted customers from the state
          const updatedCustomers = state.userManagment.deleteSellers.filter(
            (deleteSeller) => !state.userManagment.tempStates.deletedSellers.includes(deleteSeller.id)
          );
          dispatch({ type: 'UPDATE_DELETED_SELLERS_BY_ADMIN', payload: updatedCustomers });
  
          await Promise.all(
            state.userManagment.tempStates.deletedSellers.map(async (customerId) => {
              const querySnapshot = await getDocs(
                query(usersCollectionRef, where('id', '==', customerId))
              );
      
              if (!querySnapshot.empty) {
                // Get the first document (there should be only one if 'userId' is unique)
                const sellerDoc = querySnapshot.docs[0];
      
                // Delete the document from Firestore
                await updateDoc(sellerDoc.ref , {
                  status : 'active',
                });
              }
            })
          );
          
          // Clear the selection
          dispatch({ type : 'EMPTY_DELETED_SELLERS'})
          getSellersForAdmin()
          getDeletedSellersForAdmin()
        } catch (error) {
          console.error('Error deleting customers:', error);
        }
      };



    const deleteSelectedSellers = async () => {
        try {
  
          dispatch({type : 'SELLERS_TABLE_ERROR_TRUE' , payload: true})
  
          // Remove the deleted customers from the state
          const updatedCustomers = state.userManagment.sellers.filter(
            (seller) => !state.userManagment.tempStates.selectedSellers.includes(seller.id)
          );
          dispatch({ type: 'UPDATE_SELLERS_BY_ADMIN', payload: updatedCustomers });
  
          await Promise.all(
            state.userManagment.tempStates.selectedSellers.map(async (customerId) => {
              const querySnapshot = await getDocs(
                query(usersCollectionRef, where('id', '==', customerId))
              );
      
              if (!querySnapshot.empty) {
                // Get the first document (there should be only one if 'userId' is unique)
                const sellerDoc = querySnapshot.docs[0];
      
                // Delete the document from Firestore
                await updateDoc(sellerDoc.ref , {
                  status : 'deleted',
                });
              }
            })
          );
          
          // Clear the selection
          dispatch({type : 'EMPTY_SELECTED_SELLERS'})
          getSellersForAdmin()
          getDeletedSellersForAdmin()
        } catch (error) {
          console.error('Error deleting customers:', error);
        }
      };



    const deleteDeletedCustomers = async () => {
        try {
  
          dispatch({type : 'DELETED_CUSTOMERS_TABLE_ERROR_TRUE' , payload: true})
  
          // Remove the deleted customers from the state
          const updatedCustomers = state.userManagment.deletedCustomers.filter(
            (deletedCustomer) => !state.userManagment.tempStates.deletedCustomers.includes(deletedCustomer.id)
          );
          dispatch({ type: 'UPDATE_DELETED_CUSTOMERS_BY_ADMIN', payload: updatedCustomers });
  
          await Promise.all(
            state.userManagment.tempStates.deletedCustomers.map(async (customerId) => {
              const querySnapshot = await getDocs(
                query(usersCollectionRef, where('id', '==', customerId))
              );
      
              if (!querySnapshot.empty) {
                // Get the first document (there should be only one if 'userId' is unique)
                const customerDoc = querySnapshot.docs[0];
      
                // Delete the document from Firestore
                await updateDoc(customerDoc.ref , {
                  status : 'active',
                });
              }
            })
          );
          
          // Clear the selection
          
          dispatch({type : 'EMPTY_DELETED_CUSTOMERS'})
          getCustomersForAdmin()
          getDeletedCustomersForAdmin()
        } catch (error) {
          console.error('Error deleting customers:', error);
        }
      };

    const deleteSelectedCustomers = async () => {
        try {
          dispatch({type : 'CUSTOMERS_TABLE_ERROR_TRUE' , payload: true})
  
          // Remove the deleted customers from the state
          const updatedCustomers = state.userManagment.customers.filter(
            (customer) => !state.userManagment.tempStates.selectedCustomers.includes(customer.id)
          );
          dispatch({ type: 'UPDATE_CUSTOMERS_BY_ADMIN', payload: updatedCustomers });
  
          await Promise.all(
            state.userManagment.tempStates.selectedCustomers.map(async (customerId) => {
              const querySnapshot = await getDocs(
                query(usersCollectionRef, where('id', '==', customerId))
              );
      
              if (!querySnapshot.empty) {
                // Get the first document (there should be only one if 'userId' is unique)
                const customerDoc = querySnapshot.docs[0];
      
                // Delete the document from Firestore
                await updateDoc(customerDoc.ref , {
                  status : 'deleted',
                });
              }
            })
          );
          
          // Clear the selection
          dispatch({type : 'EMPTY_SELECTED_CUSTOMERS'})
          getCustomersForAdmin()
          getDeletedCustomersForAdmin()
        } catch (error) {
          console.error('Error deleting customers:', error);
        }
      };
  



    const getDeletedSellersForAdmin =()=>{
        const deletedSellersquery = query(usersCollectionRef, where('status', '==', 'deleted'),where('role', '==', 'seller') );

        dispatch({type : 'DELETED_SELLERS_TABLE_ERROR_TRUE' , payload: true})
                getDocs(deletedSellersquery)
                .then((querySnapshot) => {
                    const deletedSellersArray = []
                    querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log(userData);
                    deletedSellersArray.push(userData)
                    });

                    if(deletedSellersArray.length === 0){
                        dispatch({type : 'DELETED_SELLERS_TABLE_ERROR_FALSE' , payload: false})
                        dispatch({type : 'ADD_DELETED_SELLERS_ARRAY_INTO_STATE' , payload : deletedSellersArray})

                    }
                    else{

                        console.log(deletedSellersArray)
                        dispatch({type : 'DELETED_SELLERS_TABLE_ERROR_FALSE' , payload: false})
                        dispatch({type : 'ADD_DELETED_SELLERS_ARRAY_INTO_STATE' , payload : deletedSellersArray})
                    }
                   
                    
                })

                
                .catch((error) => {
                    console.error('Error getting documents: ', error);
                });


    }

    const getDeletedCustomersForAdmin =()=>{
        const deletedCustomersquery = query(usersCollectionRef, where('status', '==', 'deleted'),where('role', '==', 'buyer') );

        dispatch({type : 'DELETED_CUSTOMERS_TABLE_ERROR_TRUE' , payload: true})

                getDocs(deletedCustomersquery)
                .then((querySnapshot) => {
                    const deletedCustomersArray = []
                    querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log(userData);
                    deletedCustomersArray.push(userData)
                    });

                    if(deletedCustomersArray.length === 0){
                        dispatch({type : 'DELETED_CUSTOMERS_TABLE_ERROR_FALSE' , payload: false})
                        dispatch({type : 'ADD_DELETED_CUSTOMERS_ARRAY_INTO_STATE' , payload : deletedCustomersArray})

                    }
                    else{

                        console.log(deletedCustomersArray)
                        dispatch({type : 'DELETED_CUSTOMERS_TABLE_ERROR_FALSE' , payload: false})
                        dispatch({type : 'ADD_DELETED_CUSTOMERS_ARRAY_INTO_STATE' , payload : deletedCustomersArray})
                    }
                   
                    
                })

                
                .catch((error) => {
                    console.error('Error getting documents: ', error);
                });


    }

    const getSellersForAdmin =()=>{
        const customerquery = query(usersCollectionRef, where('role', '==', 'seller'),
        where('status', '==', 'active'));

        dispatch({type : 'SELLERS_TABLE_ERROR_TRUE' , payload: true})

                getDocs(customerquery)
                .then((querySnapshot) => {
                    const sellersArray = []
                    querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log(userData);
                    sellersArray.push(userData)
                    });


                    if(sellersArray.length === 0 ){
                        dispatch({type : 'SELLER_TABLE_ERROR_FALSE' , payload: false})
                        dispatch({type : 'ADD_SELLERS_ARRAY_INTO_STATE' , payload : sellersArray})
                    }
                    else{
                        console.log(sellersArray)
                        dispatch({type : 'SELLER_TABLE_ERROR_FALSE' , payload: false})
                    dispatch({type : 'ADD_SELLERS_ARRAY_INTO_STATE' , payload : sellersArray})
                    }
                    
                    
                })

                
                .catch((error) => {
                    console.error('Error getting documents: ', error);
                });


    }
    
    const getCustomersForAdmin = () => {
        const customerquery = query(
          usersCollectionRef,
          where('role', '==', 'buyer'),
          where('status', '==', 'active')
        );
      
        dispatch({type : 'CUSTOMERS_TABLE_ERROR_TRUE' , payload: true})
        getDocs(customerquery)
          .then((querySnapshot) => {
            const customersArray = [];
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              customersArray.push(userData);
            });
      
            if (customersArray.length === 0) {
                dispatch({type : 'CUSTOMERS_TABLE_ERROR_FALSE' , payload: false})
              dispatch({
                type: 'ADD_CUSTOMERS_ARRAY_INTO_STATE',
                payload: customersArray,
              });

            } else {
              console.log(customersArray);
              dispatch({type : 'CUSTOMERS_TABLE_ERROR_FALSE' , payload: false})
              dispatch({
                type: 'ADD_CUSTOMERS_ARRAY_INTO_STATE',
                payload: customersArray,
              });
            }
          })
          .catch((error) => {
            console.error('Error getting documents: ', error);
          });
      };
      


    const fetchUserRole = async () => {
        try {
          
          if (auth?.currentUser) {
   
            
            const userUid = auth.currentUser.uid;

            const userQuery = query(usersCollectionRef, where('id', '==', userUid));
            const querySnapshot = await getDocs(userQuery);
  
            if (!querySnapshot.empty) {
        
                
              const userData = querySnapshot.docs[0].data();

              console.error('USER>>>>>>',userData.firstname)
     
              dispatch({type : 'SET_USER_ROLE_AND_NAME' , payload : {
                role : userData.role,
                name : userData.firstname,
                email: userData.email
              }})
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };

    


    const getGeoLocationApi = async(locationUrl)=>{

        try {
            const location = await axios.get(locationUrl)
            const data = await location.data
            dispatch({type : 'GET_USER_LOACTION_HEADER' , payload: {
                country: data.country,
                city : data.city,
            }})
            
        } catch (error) {
            console.log(error)
        }
    
    }
    




    const createSeller =async(e)=>{
        e.preventDefault()
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
                 
                          const userDoc = querySnapshot.docs[0];
                    
                      
                          await updateDoc(userDoc.ref, {
                          
                                
                                firstname : state.vendor.firstname,
                                lastname : state.vendor.lastname,
                                phone: state.vendor.phone,
                                bName:state.vendor.bName,
                                bDescription: state.vendor.bDescription,
                                role : 'seller',
                                city : state.vendor.city,
                                country :state.vendor.country,
                                address : state.vendor.address,
                                status : 'active'
                            
                          });

                          dispatch({type : 'VENDOR_REGISTER_SUCCESS' , payload : 'signIn' })
                          dispatch({type : 'VENDOR_REGISTER_USER' , payload : 'vendor-register'})
                          showCurrentUser()
                          dispatch({type : 'VENDOR_EMPTY_REGISTER_FORM' })      
                          dispatch({type : 'REGISTER_NO_ERROR' })
                          fetchUserRole();
                          dispatch({type : 'EMPTY_VENDOR_ERRORS'})
                          return navigate('/');
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
                                status: 'active'
    
                            }
    
                            dispatch({type : 'VENDOR_REGISTER_USER' , payload : 'vendor-register'})
                            showCurrentUser()
                            await addDoc(usersCollectionRef, vendorUser);
                            dispatch({type : 'VENDOR_EMPTY_REGISTER_FORM' })      
                            dispatch({type : 'REGISTER_NO_ERROR' })
                            fetchUserRole();
                            dispatch({type : 'EMPTY_VENDOR_ERRORS'})
                            return navigate('/');
            
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


    const vendorDetails = async(e)=>{
        e.preventDefault()
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

    
    const vendorEmail = async(e)=>{
        
        e.preventDefault()
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
                dispatch({type : 'SET_GOOGLE_USER_NAME', payload : name })
                showSellerAccount()
                showCustomerAccount()
                showAdminAccount()
                fetchUserRole();
                return navigate('/'); // Exit the function to prevent adding duplicate users.
        
                }
          
        
           
              // User is not already signed up with Google, so we can proceed to add them to the database
        
              const googleUser = {
                id: uid,
                firstname: name,
                lastname: '',
                email: email,
                role: 'buyer',
                status : 'active'
              };
        
              
        
            
              await addDoc(usersCollectionRef, googleUser);
              dispatch({ type: 'GOOGLE_SIGN_UP', payload: 'google new sign up ' });
              dispatch({type : 'SET_GOOGLE_USER_NAME', payload : name })
              showSellerAccount()
              showCustomerAccount()
              showAdminAccount()
              fetchUserRole();
              return navigate('/'); 
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
            dispatch({type : 'MAKE_ACCOUNT_FALSE'})
            
            showCurrentUser()
            
        }










       const loginTheUser = async (event) => {
  event.preventDefault();

  if (state.loginUser.email === '' || state.loginUser.password === '') {
    dispatch({ type: 'PLEASE_FILL_LOGIN' });

    if (state.loginUser.email === '') {
      dispatch({ type: 'LOGIN_EMAIL_EMPTY' });
    }
    if (state.loginUser.password === '') {
      dispatch({ type: 'LOGIN_PASSWORD_EMPTY' });
    }
  } else {
    if (auth?.currentUser?.email !== undefined) {
      dispatch({ type: 'PLEASE_LOG_OUT_FIRST_LOGIN' });
    } else {
      dispatch({ type: 'PLEASE_LOG_OUT_FIRST_LOGIN_RESOLVE' });
      dispatch({ type: 'LOGIN_ERRORS_SOLVE' });
      dispatch({ type: 'LOGIN_LOADING' });

      // Check if the user exists in the "users" collection and has status set to "active"
      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('email', '==', state.loginUser.email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.status === 'active') {
          try {
            const user = await signInWithEmailAndPassword(auth, state.loginUser.email, state.loginUser.password);
            console.log(user);
            dispatch({ type: 'LOGIN_USER', payload: 'login' });
            showCurrentUser();
            if (user.operationType === 'signIn') {
              dispatch({ type: 'USER_FOUND', payload: user.operationType });
              showSellerAccount()
              showCustomerAccount()
              showAdminAccount()
              fetchUserRole();
              dispatch({ type: 'PLEASE_LOG_OUT_FIRST_LOGIN_RESOLVE' });
              return navigate('/');
            }
          } catch (error) {
            // Handle sign-in errors here
            console.log('OOH MY GOD',error)
            if (error.code === 'auth/wrong-password') {
              dispatch({ type: 'WRONG_PASSWORD', payload: error.code });
              console.log(error);
            } else if (error.code === 'auth/invalid-email') {
              dispatch({ type: 'INVALID_EMAIL', payload: error.code });
              console.log(error);
            } else if (error.code === 'auth/network-request-failed') {
              dispatch({ type: 'NETWORK_ERROR', payload: error.code });
            } else {
              console.error(error);
            }
          }
        } else {
          // User exists but status is not active
          console.log('User is not active.');
          dispatch({type: 'LOGIN_USER_IS_DELETED' , payload : 'deleted'})
          // Handle this case as needed (e.g., show an error message)
        }
      } else {
        // User does not exist in the "users" collection
        console.log('User not found.');
        dispatch({type : 'LOGIN_USER_NOT_FOUND' , payload: 'auth/user-not-found' })
        // Handle this case as needed (e.g., show an error message)
      }
    }
  }
};

        
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
                    status : 'active'
                  };
    
                
                dispatch({type : 'REGISTER_USER' , payload : 'register'})
                showCurrentUser()
                await addDoc(usersCollectionRef, createRegisterUser);
                dispatch({type : 'EMPTY_REGISTER_FORM' })      
                dispatch({type : 'REGISTER_NO_ERROR' })
                fetchUserRole();
                dispatch({type: 'PLEASE_LOG_OUT_FIRST_REGISTER_RESOLVE'})
                return navigate('/');


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



    const getProductsForAdmin = async (url) => {
  

      console.log(state.products)
      try {

        // Assuming `getProductsData` is an array of product
        for (const product of state.products) {
          // Check if a product with the same identifier (e.g., product.id) exists in the Firestore collection
          const productQuery = query(productsCollectionRef, where('id', '==', product.id));
          const productQuerySnapshot = await getDocs(productQuery);
    
          if (productQuerySnapshot.size === 0) {
            // If no matching product exists, add it to the collection
            await addDoc(productsCollectionRef, product);
          }
        }

        const productsArray = [];

        // Query the entire products collection
        const collectionSnapshot = await getDocs(productsCollectionRef);
        collectionSnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
    
        // Log the entire products collection as one object
        console.log('Products Collection:', productsArray);
    
        
      } catch (error) {
        dispatch({ type: 'SET_API_ERROR' });
      }
    };



    // const getProducts = async () => {
    //   dispatch({ type: 'SET_API_LOADING' });
    
    //   try {
    //     const querySnapshot = await getDocs(productsCollectionRef);
    //     const productsArray = [];
    
    //     querySnapshot.forEach((doc) => {
    //       // Assuming your Firestore documents have a 'name' field, you can access it like this
    //       const productData = doc.data();
    //       productsArray.push(productData);
    //     });
        
    //     dispatch({ type: 'SET_API_DATA', payload: productsArray });
    //   } catch (error) {
    //     dispatch({ type: 'SET_API_ERROR' });
    //   }
    // };


    const getProducts = async () => {
      dispatch({ type: 'SET_API_LOADING' });
    
      try {
        const querySnapshot = await getDocs(query(productsCollectionRef, where('status', '==', 'active')));
        const productsArray = [];
    
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          productsArray.push(productData);
        });
    
        dispatch({ type: 'SET_API_DATA', payload: productsArray });
      } catch (error) {
        dispatch({ type: 'SET_API_ERROR' });
      }
    };
    


    //single product api call 

    // const  getSingleProduct = async(id)=>{
    //     dispatch({type : 'SET_SINGLE_LOADING'})
    //     try {
    //         console.log('Product url>>>>', id)
    //         const res = await axios.get(id);
    //         const singleProduct =  res.data
    //         console.log(singleProduct)
    //         dispatch({type: 'SET_SINGLE_PRODUCT' , payload : singleProduct})
            
    //     } catch (error) {
    //         dispatch({type : 'SET_SINGLE_ERROR'})
    //     }


    // }



    const getSingleProduct = async (id) => {
      dispatch({ type: 'SET_SINGLE_LOADING' });
      try {
        const numId = Number(id)
        const q = query(productsCollectionRef, where('id', '==', numId));
    
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const singleProduct = querySnapshot.docs[0].data();
    
          console.log(singleProduct);
    
          dispatch({ type: 'SET_SINGLE_PRODUCT', payload: singleProduct });
          // dispatch({type: 'CONSOLE_SINGLE_PRODUCT'})
          dispatch({ type: 'SET_SINGLE_LOADING_FALSE'})
        } else {
          console.error('No matching document found.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        dispatch({ type: 'SET_SINGLE_ERROR' });
      }
    };



    const GetTotalQuantityPrice = ()=>{
        dispatch({type : 'TOTAL_QUANTITY_PRICE', payload : {
          localCart : state.localStorageCart,
          localPrice : state.localCartTotalPrice,
          localQuantity : state.localCartTotalQuantity,
        }})
    }

    const GettingCartItem = (item)=>{
        console.error('RUNNED')
        
        dispatch({type: 'GETTING_CART_ITEM' , payload : {
          item : item,
          localCart : state.localStorageCart,
          localQuantity : state.localCartTotalQuantity,
          localPrice : state.localCartTotalPrice,
        } })
        // GetTotalQuantityPrice()
        console.log(state.cartItem)
        
        
    }

    const cartHandling = ()=>{
        dispatch({type : 'CART_HANDLING'})
    }

    const cartItemIncreament = (item , product) =>{
        dispatch({type : 'CART_ITEM_INCREAMENT' , payload: {
            item: item,
            product: product,
            localCart : state.localStorageCart,
        }})


        // GetTotalQuantityPrice()
    }
    const cartItemDecreament = (item , product) =>{
        dispatch({type : 'CART_ITEM_DECREAMENT' , payload: {
            item: item,
            product: product,
            localCart : state.localStorageCart,
        }})


        // GetTotalQuantityPrice()
    }

    

     

    useEffect(()=>{
  
        getProducts(API);
           
        getGeoLocationApi(geoLoactionApi)

       
        getCustomersForAdmin()
        getSellersForAdmin()

        getDeletedCustomersForAdmin()
        getDeletedSellersForAdmin()
        getOrdersDataforAdmin()
        // showSellerAccount()
        // showCustomerAccount()
        // showAdminAccount()
      
       

        console.log('USER NAME >>>>> ', state.user.name)
        console.log('i fire once');

    },[state.currentUser])

    return <AppContext.Provider value={{...state, getSingleProduct , GettingCartItem, cartHandling ,cartItemIncreament ,cartItemDecreament ,dispatch , createUser , loginTheUser , cUser , logOut, signUpWithGoogle ,addDoc , usersCollectionRef, vendorEmail, vendorDetails , createSeller, getCustomersForAdmin , getSellersForAdmin, getDeletedCustomersForAdmin, getDeletedSellersForAdmin,
    deleteSelectedCustomers, deleteDeletedCustomers, deleteSelectedSellers, deleteDeletedSellers, getAllProductsForAdmin, handleEditProductClick, deleteSelectedProducts, getProductsStatus, getAllDeletedProductsForAdmin, deleteDeletedProducts, singleProductEdited , addProductForAdmin, showSellerAccount, showCustomerAccount, showAdminAccount, saveOrderDataToFireBase, generateUniqueNumberId,
    makeOrderComplete , getOrdersDataforAdmin , makeOrderCancel , getCancelOrdersDataforAdmin}}>{children}</AppContext.Provider>
}

// custom hook

const useProductContext = () =>{
    return useContext(AppContext)

}
 
export {AppProvider, AppContext , useProductContext}