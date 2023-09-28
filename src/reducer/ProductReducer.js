

const ProductReducer = (state, action) => {



  


  switch (action.type) {
    case "SET_API_LOADING":
      return { ...state, isLoading: true };
      break;
    case "SET_API_ERROR":
      return { ...state, isLoading: false, isError: true };
      break;

    case "SET_API_DATA":
      return {
        ...state,
        isLoading: false,
        isError: false,
        products: action.payload,
      };
      break;
    case "SET_SINGLE_LOADING":
      return { ...state, isSinlgleLoading: true };
      break;
    case "SET_SINGLE_PRODUCT":
      return {
        ...state,
        singleProduct: action.payload,
      };
    case 'CONSOLE_SINGLE_PRODUCT':
      console.log(state.singleProduct)
      return state
    case 'SET_SINGLE_LOADING_FALSE':
      return{...state, isSinlgleLoading : false }
    case 'SET_SINGLE_PRODUCT_TITLE':
      return{...state , singleProduct : {...state.singleProduct,  title : action.payload }}
    case 'SET_SINGLE_PRODUCT_PRICE':
      return{...state , singleProduct: {...state.singleProduct, price : Number(action.payload)}}
    case 'SET_SINGLE_PRODUCT_CATEGORY':
      return{...state , singleProduct: {...state.singleProduct, category : action.payload}}
    case 'SET_SINGLE_PRODUCT_DESCRIPTION':
      return{...state , singleProduct : {...state.singleProduct , description : action.payload } }
    case 'SET_SINGLE_PRODUCT_IMAGE':
      console.error(action.payload)
      return{...state, singleProduct: {...state.singleProduct , image : action.payload}}
    case "SET_SINGLE_ERROR":
      return { ...state, isSinlgleLoading: false, isError: true };
      break;

    case "CART_HANDLING":
      if (state.isCart === false) {
        return { ...state, isCart: true };
        break;
      } else if (state.isCart === true) {
        return { ...state, isCart: false };
        break;
      }
      break;
      case "GETTING_CART_ITEM":
        // console.log(action.payload)
        // return state
        // Get the current cart items from localStorage
       
        const localStorageCart = action.payload.localCart ;
        // Get the index of the product in localStorageCart
    const productIndex = localStorageCart.findIndex((item) => item.id === action.payload.item.id);
  
    if (productIndex !== -1) {
      let limitedItemPriceNumber
      // If the product exists in localStorageCart, update it
      const updatedCart = localStorageCart.map((item, index) => {
        if (index === productIndex) {
          const itemprice = item.price + action.payload.item.price;
          const limitedItemPrice = itemprice.toFixed(2);
           limitedItemPriceNumber = parseFloat(limitedItemPrice);
          return { ...item, quantity: item.quantity + 1, price: limitedItemPriceNumber };
        }
        return item;
      });
  
      // Update the localStorage with the updated cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem('quantity', action.payload.localQuantity + 1)
      localStorage.setItem('price', action.payload.localPrice + action.payload.item.price )
      
  
      return {
        ...state,
        cartItem: updatedCart,
        localStorageCart : updatedCart,
        localCartTotalQuantity : state.localCartTotalQuantity + 1,
        localCartTotalPrice : state.localCartTotalPrice + action.payload.item.price,
      };
    } else {
      // If the product doesn't exist in localStorageCart, add it
      const updatedCart = [...localStorageCart, { ...action.payload.item, quantity: 1 }];
  
      // Update the localStorage with the updated cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.setItem('quantity', action.payload.localQuantity + 1 )
      localStorage.setItem('price' , action.payload.localPrice + action.payload.item.price)
  
      return{
        ...state,
        cartItem: updatedCart,
        localStorageCart : updatedCart,
        localCartTotalQuantity : state.localCartTotalQuantity + 1,
        localCartTotalPrice : state.localCartTotalPrice + action.payload.item.price,
      };
    }
      

    case "CART_ITEM_INCREAMENT":

      const localStorageCartInc = action.payload.localCart ;
      const productIncreamenttIndex = localStorageCartInc.findIndex(
        (item) => item.id === action.payload.item.id
      );
      console.log(productIncreamenttIndex);
      let limitedIncPriceNumber

     const updatedCartInc =  localStorageCartInc.map((item, index) => {
        if (index === productIncreamenttIndex) {
          const incPrice = item.price + action.payload.product.price
          const limitedIncPrice = incPrice.toFixed(2)
          limitedIncPriceNumber = parseFloat(limitedIncPrice)
          return { ...item, quantity: item.quantity + 1 , price : limitedIncPriceNumber };
        }
        return item;
      })

      localStorage.setItem("cart", JSON.stringify(updatedCartInc));
      localStorage.setItem('quantity', state.localCartTotalQuantity + 1)
      localStorage.setItem('price' , state.localCartTotalPrice + action.payload.product.price  )
      return {
        ...state,
        cartItem: updatedCartInc,
        localStorageCart : updatedCartInc,
        localCartTotalQuantity : state.localCartTotalQuantity + 1,
        localCartTotalPrice: state.localCartTotalPrice + action.payload.product.price ,
      };

      case "CART_ITEM_DECREAMENT":

        const localStorageCartDec = action.payload.localCart

        const productDecrementIndex = localStorageCartDec.findIndex(
          (item) => item.id === action.payload.item.id
        );
      
        if (productDecrementIndex === -1) {
          return state; // Item not found, return the current state
        }
      
        const updatedCartItemDec = localStorageCartDec.map((item, index) => {
            if (index === productDecrementIndex) {
              if (item.quantity > 1) {
                const decPrice = item.price - action.payload.product.price;
                const limitedDecPrice = decPrice.toFixed(2);
                const limitedDecPriceNumber = parseFloat(limitedDecPrice);
                return { ...item, quantity: item.quantity - 1, price: limitedDecPriceNumber };
              } else {
                return null;
              }
            }
            return item;
          })
          .filter((item) => item !== null);
      
        const newTotalQuantity = updatedCartItemDec.reduce((total, item) => total + item.quantity, 0);
        const newTotalPrice = updatedCartItemDec.reduce((total, item) => total + item.price * item.quantity, 0);
          
        localStorage.setItem("cart", JSON.stringify(updatedCartItemDec));
        localStorage.setItem('quantity', state.localCartTotalQuantity - 1  )
        localStorage.setItem('price', state.localCartTotalPrice - action.payload.product.price )
        return {
          ...state,
          cartItem: updatedCartItemDec,
          totalQuantity: newTotalQuantity,
          totalPrice: newTotalPrice,
          localStorageCart : updatedCartItemDec,
          localCartTotalQuantity : state.localCartTotalQuantity - 1,
          localCartTotalPrice : state.localCartTotalPrice - action.payload.product.price,
        };

      case 'TOTAL_QUANTITY_PRICE':

          const TQPlocalStorageCart = action.payload.localCart
        if (TQPlocalStorageCart.length > 0) {
          const updatedCartItemsTotal = TQPlocalStorageCart.map((item) => ({
            ...item, // Keep the existing item properties
          }));
      
          let totalQuantity = 0;
          let totalPrice = 0;
      
          updatedCartItemsTotal.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.price;
          });

          
          const limitedTotalPrice = totalPrice.toFixed(2)

          localStorage.setItem("cart", JSON.stringify(updatedCartItemsTotal));
          localStorage.setItem('quantity', totalQuantity )
          localStorage.setItem('price', parseFloat(limitedTotalPrice) )
      
          return {
            ...state,
            cartItem: updatedCartItemsTotal,
            totalQuantity: totalQuantity,
            totalPrice: parseFloat(limitedTotalPrice),
            localStorageCart: updatedCartItemsTotal,
            localCartTotalPrice : parseFloat(limitedTotalPrice),
            localQuantity : totalQuantity,
          };
        }
      
        // If cart is empty, return the state as is
        return state;
      case 'REGISTER_FNAME':
        console.log(action.payload)
        return {...state , registerUser: {...state.registerUser , firstname: action.payload }}

      case 'REGISTER_LNAME':
        console.log(action.payload)
        return {...state , registerUser: {...state.registerUser , lastname: action.payload }}

      case 'REGISTER_EMAIL' : 
        console.log(action.payload)
        return {...state , registerUser : {...state.registerUser , email : action.payload}}
        break

      case 'REGISTER_PASSWORD' : 
        console.log(action.payload)
        return {...state , registerUser : {...state.registerUser , password : action.payload}}
        break
      case 'LOGIN_EMAIL':
        console.log(action.payload)
        return {...state , loginUser : {...state.loginUser , email : action.payload}}
        break
      case 'LOGIN_PASSWORD':
        console.log(action.payload)
        return {...state , loginUser : {...state.loginUser , password : action.payload}}
        break
      case 'REGISTER_USER':
        console.log('reagister user runned')
        return {...state , currentUser : action.payload }
      case 'LOGIN_USER':
        return {...state , currentUser : action.payload }
      case 'LOGOUT_USER':

        return {...state , currentUser : action.payload , user : {...state.user , role : ''}}
      case 'GOOGLE_SIGN_UP':
        localStorage.setItem('loginAccountPage', 'customerAccount')
        return{...state , currentUser : action.payload}
      case 'SET_GOOGLE_USER_NAME': 
        localStorage.setItem('userName', action.payload )
      case 'CREATE_USER' : 
        console.log('create user runned')
        return {...state , user : {...state.user , firstname: action.payload.firstname , lastname : action.payload.lastname , id : action.payload.uid , email : action.payload.email , role : 'buyer' }}
      case 'EMPTY_REGISTER_FORM': 
        return {...state , registerUser : {...state.registerUser , firstname : '', lastname: '' , email : '' , password : '' }}
      case 'USER_NOT_FOUND': 
        return {...state , loginError : action.payload , loginLoading : false}
      case 'USER_FOUND':
        return {...state , loginError: action.payload , loginUser : {...state.loginUser , email : '' , password : ''} , loginLoading : false }
      case 'NETOWRK_ERROR':
        return{...state , loginError: action.payload }
      case 'REGISTER_ERROR':
        return {...state , registerError : action.payload , registerLoading : false }
      case 'REGISTER_NO_ERROR' : 
        return {...state, registerError: '', registerLoading : false }
      case 'REGISTER_SUCCESS': 
        localStorage.setItem('loginAccountPage', 'customerAccount')
        return {...state ,  registerError : action.payload , registerLoading : false}
      case 'REGISTER_LOADING_TRUE':
        return {...state , registerLoading : true , registerError : ''  }
      case 'REGISTER_INVALID': 
        return {...state , registerError : action.payload , registerLoading : false }
      case 'INPUT_FNAME_ERROR':
        return{...state , inputFieldError : {...state.inputFieldError , fname : true}}
      case 'INPUT_LNAME_ERROR':
        return{...state , inputFieldError : {...state.inputFieldError , lname : true}}
      case 'INPUT_EMAIL_ERROR':
        return{...state , inputFieldError : {...state.inputFieldError , email : true}}
      case 'INPUT_PASS_ERROR':
        return{...state , inputFieldError : {...state.inputFieldError , password : true}}
      case 'INPUT_ERRORS_SOLVE':
        return{...state , inputFieldError : {...state.inputFieldError , fname : false,lname : false, email : false, password : false}}
      case 'PLEASE_FILL':
        return{...state , registerError : 'empty-fields' }
      case 'LOGIN_LOADING': 
        return{...state , loginError : '' , loginLoading : true }
      case 'WRONG_PASSWORD': 
        return{...state , loginError : action.payload ,loginLoading : false }
      case 'LOGIN_USER_NOT_FOUND':
        return{...state , loginError : action.payload , loginLoading: false}
      case 'INVALID_EMAIL':
        return{...state , loginError : action.payload , loginLoading : false}
      case 'LOGIN_USER_IS_DELETED' : 
        return{...state , loginError : action.payload , loginLoading : false}
      case 'LOGIN_EMAIL_EMPTY': 
        return{...state , loginInputError : {...state.loginInputError , email : true } }
      case 'LOGIN_PASSWORD_EMPTY': 
        return{...state , loginInputError : {...state.loginInputError , password : true}}
      case 'LOGIN_ERRORS_SOLVE':
        return{...state , loginInputError: {...state.loginInputError , email : false ,  password : false } }
      case 'PLEASE_FILL_LOGIN': 
        return{...state , loginError : 'empty-fields'  }
      case 'REGISTER_WITH_GOOGLE':
        return{...state , registerUser : {...state.registerUser , firstname : action.payload.name , email : action.payload.email , id : action.payload.uid }}
      case 'PLEASE_LOG_OUT_FIRST_REGISTER':
        return{...state , registerError : 'someone-logged-in'}
      case 'PLEASE_LOG_OUT_FIRST_LOGIN':
        return{...state , loginError : 'someone-logged-in'  }
      case 'PLEASE_LOG_OUT_FIRST_LOGIN_RESOLVE':
        return{...state, loginError : ''}
      case 'PLEASE_LOG_OUT_FIRST_REGISTER_RESOLVE':
        return{...state, registerError: '' }
      case 'PLEASE_LOG_OUT_FiRST_RESOLVE':
        return{...state , loginError : '' , registerError : '' }
      case 'PLEASE_LOG_OUT_FIRST_GOOGLE':
        return{...state, googleError : 'someone-logged-in'}
      case 'PLEASE_LOG_OUT_FiRST_GOOGLE_RESOLVE':
        return{...state, googleError : ''}
      case 'NETWORK_ERROR':
        return{...state , googleError: 'network-error'  }
      case 'NETWORK_REQUEST_FAILED': 
        return{...state, registerError: action.payload}
      case 'VENDOR_EMAIL_ONCHANGE':
        console.log(action.payload)
        return{...state, vendor : {...state.vendor , email : action.payload   }}
      case 'SET_VENDOR_EMAIL_TO_LOGIN_EMAIL':
        return{...state, vendor : {...state.vendor , email : action.payload   } }
      case 'CHANGE_VENDOR_FORM_STATE':
        return{...state, venderSection : action.payload }
      case 'MAKE_VENDOR_EMAIL':
        return{...state , venderSection : 'vendor-email'}
      case 'MAKE_PERSONAL_DETAILS':
        return{...state , venderSection : 'personal-details'}
      case 'MAKE_BUSINESS_DETAILS':
        return{...state, venderSection : 'business-details'}
      case 'ENABLE_VENDOR_LOADING':
        return{...state , vendorLoading : true , vendorError : {...state.vendorError , email : '' } }
      case 'VENDOR_EMAIL_ALREADY_EXIST':
        return{...state, vendorError :{...state.vendorError , email: action.payload }, vendorLoading: false }
      case 'FORWARD_VENDOR_FORM_STATE':
        return{...state,  venderSection : action.payload , vendorLoading : false }
      case 'VENDOR_EMAIL_EMPTY':
        return{...state ,  vendorError : {...state.vendorError, email: action.payload}}
      case 'VENDOR_FNAME':
        return{...state, vendor : {...state.vendor , firstname : action.payload}}
      case 'VENDOR_LNAME':
        return{...state , vendor : {...state.vendor , lastname : action.payload}}
      case 'VENDOR_PASSWORD':
        return{...state, vendor : {...state.vendor , password : action.payload}}
      case 'VENDOR_PHONE':
        return{...state , vendor : {...state.vendor , phone : action.payload}}
      case 'EMPTY_VENDOR_DETAILS_FIELDS':
        return{...state, vendorError : {...state.vendorError , details : action.payload}}
      case 'VENDOR_FNAME_INPUT_ERROR_TRUE':
        return{...state , vendorInputError: {...state.vendorInputError ,fname : true }}
      case 'VENDOR_LNAME_INPUT_ERROR_TRUE':
        return{...state ,  vendorInputError: {...state.vendorInputError ,lname : true }}
      case 'VENDOR_EMAIL_INPUT_ERROR_TRUE':
        return{...state,vendorInputError: {...state.vendorInputError ,email : true } }
      case 'VENDOR_PASSWORD_INPUT_ERROR_TRUE':
        return{...state ,  vendorInputError: {...state.vendorInputError, password : true }}
      case 'VENDOR_PHONE_INPUT_ERROR_TRUE':
        return{...state ,  vendorInputError: {...state.vendorInputError, phone : true } }
      case 'EMPTY_VENDOR_DETAILS_FIELDS_RESOLVE':
        return{...state , vendorError : {...state.vendorError , details : ''} , vendorInputError : {...state.vendorInputError , fname : false , lname : false , email : false , password : false , phone : false} , venderSection : action.payload}
      case 'VENDOR_BNAME':
        return{...state , vendor : {...state.vendor , bName : action.payload}}
      case 'VENDOR_BDESCRIPTION': 
        return{...state , vendor : {...state.vendor , bDescription: action.payload }}
      case 'VENDOR_CITY':
        return{...state, vendor : {...state.vendor  , city: action.payload }}
      case 'VENDOR_COUNTRY':
        return{...state , vendor : {...state.vendor , country: action.payload}}
      case 'VENDOR_ADDRESS': 
        return{...state, vendor: {...state.vendor , address : action.payload }}
      case 'VENDOR_BNAME_INPUT_ERROR_TRUE':
         return{...state , vendorInputError : {...state.vendorInputError , bName: true } }
      case 'VENDOR_BDESCRIPTION_INPUT_ERROR_TRUE': 
        return{...state, vendorInputError: {...state.vendorInputError , bDescription : true }}
      case 'VENDOR_CITY_INPUT_ERROR_TRUE':
        return{...state, vendorInputError: {...state.vendorInputError , city : true } }
      case 'VENDOR_COUNTRY_INPUT_ERROR_TRUE': 
        return{...state , vendorInputError: {...state.vendorInputError , country: true } }
      case 'VENDOR_ADDRESS_INPUT_ERROR_TRUE': 
        return{...state , vendorInputError : {...state.vendorInputError , address:true }}
      case 'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS':
        return{...state, vendorError: {...state.vendorError , business : action.payload } }
      case 'VENDOR_BUSINESS_DETAILS_EMPTY_FIELDS_RESOLVE':
        return{...state, vendorInputError :{...state.vendorInputError , bName: false, bDescription: false , city : false , country: false, address: false }, vendorError : {...state.vendorError , business : '' } }
      case 'PLEASE_FILL_THE_PREVIOUS_VENDOR_FORMS':
        return{...state, vendorError : {...state.vendorError , main : action.payload }  }
      case 'VENDOR_INPUT_ERRORS_SOLVE': 
        return{...state, vendorInputError : {...state.vendorInputError , fname : false , lname : false , email : false , password : false , phone : false} ,  vendorError : {...state.vendorError , main : '' , business : '' } }
      case 'VENDOR_LOADING_TRUE':
        return{...state,  vendorLoading : true }
      case 'VENDOR_REGISTER_SUCCESS':
        localStorage.setItem('loginAccountPage', 'sellerAccount')
        return{...state , vendorError : {...state.vendorError , business: action.payload } , vendorLoading : false }
      case 'VENDOR_REGISTER_USER':
        localStorage.setItem('loginAccountPage', 'sellerAccount')
        return{...state , currentUser : action.payload }
      case 'VENDOR_EMPTY_REGISTER_FORM':
        return{...state , vendor : {...state.vendor , firstname : '', lastname : '', email : '', password : '', phone : '' , bname : '' , bDescription : '' , city : '' , country : '' , address : '' }}
      case 'REGISTER_NO_ERROR':
        return{...state ,   vendorError : {...state.vendorError , business: '' }}
      case 'VENDOR_EMAIL_ALREADY_ERROR':
        return{...state, vendorError : {...state.vendorError , business: action.payload }}
      case 'VENDOR_REGISTER_INVALID': 
        return{...state,  vendorError : {...state.vendorError , business: action.payload }}
      case 'VENDOR_NETWORK_REQUEST_FAILED':
        return{...state,  vendorError : {...state.vendorError , business: action.payload } }
      case 'EMPTY_VENDOR_ERRORS':
        return{...state, vendorError:{...state.vendorError ,  main : '', email : '', details : '', business : ''  } }
      case 'GET_USER_LOACTION_HEADER':
        return{...state , location : {...state.location , country : action.payload.country , city :action.payload.city }}
      case 'SHOW_SIGN_IN_DROPDOWN':
          return{...state, signInDropdown: true  }
      case 'MAKE_SIGNUP_DROPDOWN_FALSE':
          return{...state, signInDropdown: false  }
      case 'SET_USER_ROLE_AND_NAME':
        localStorage.setItem('userName' , action.payload.name )
        localStorage.setItem('userEmail' , action.payload.email )
        return{...state , user : {...state.user , role : action.payload.role , name : action.payload.name } , localUserEmail:  action.payload.email  }
      case 'ADD_CUSTOMERS_ARRAY_INTO_STATE':
        return{...state , userManagment: {...state.userManagment , customers :action.payload}}
      case 'ADD_SELLERS_ARRAY_INTO_STATE':
        return{...state , userManagment:{...state.userManagment , sellers : action.payload}}
      case 'UPDATE_CUSTOMERS_BY_ADMIN':
        return{...state, userManagment: {...state.userManagment , customers : action.payload} }
      case 'UPDATE_SELLERS_BY_ADMIN':
        return{...state, userManagment : {...state.userManagment , sellers : action.payload} }
      case 'CUSTOMERS_TABLE_ERROR_TRUE':
        return{...state, userManagment : {...state.userManagment , customersTableError : action.payload }}
      case 'CUSTOMERS_TABLE_ERROR_FALSE':
        return{...state, userManagment : {...state.userManagment , customersTableError : action.payload }}
      case 'SELLERS_TABLE_ERROR_TRUE':
        return{...state, userManagment : {...state.userManagment , sellersTableError : action.payload }}
      case 'SELLER_TABLE_ERROR_FALSE':
        return{...state, userManagment : {...state.userManagment , sellersTableError : action.payload }}
      case 'DELETED_CUSTOMERS_TABLE_ERROR_TRUE':
        return{...state, userManagment : {...state.userManagment , deletedCustomerError : action.payload }}
      case 'DELETED_CUSTOMERS_TABLE_ERROR_FALSE':
        return{...state, userManagment : {...state.userManagment , deletedCustomerError : action.payload }}
      case 'DELETED_SELLERS_TABLE_ERROR_TRUE':
        return{...state , userManagment : {...state.userManagment , deletedSellersError : action.payload}}
      case 'DELETED_SELLERS_TABLE_ERROR_FALSE':
        return{...state , userManagment : {...state.userManagment , deletedSellersError : action.payload}}  
      case 'ADD_DELETED_CUSTOMERS_ARRAY_INTO_STATE':
        return{...state, userManagment : {...state.userManagment, deletedCustomers : action.payload} }
      case 'ADD_DELETED_SELLERS_ARRAY_INTO_STATE':
        return{...state , userManagment : {...state.userManagment , deleteSellers : action.payload }}
      case 'UPDATE_DELETED_CUSTOMERS_BY_ADMIN':
        return{...state , userManagment : {...state.userManagment , deletedCustomers : action.payload}  }
      case 'UPDATE_DELETED_SELLERS_BY_ADMIN':
        return{...state, userManagment : {...state.userManagment , deleteSellers : action.payload}}
      case 'SET_SELECTED_CUSTOMERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , selectedCustomers : action.payload }  }}
      case 'EMPTY_SELECTED_CUSTOMERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , selectedCustomers : [] }  }}
      case 'EMPTY_DELETED_CUSTOMERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , deletedCustomers : [] }  }}
      case 'SET_DELETED_CUSTOMERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , deletedCustomers : action.payload }  }}
      case 'EMPTY_SELECTED_SELLERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , selectedSellers : [] }  }}
      case 'SET_SELECTED_SELLERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , selectedSellers : action.payload }  }}
      case 'EMPTY_DELETED_SELLERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , deletedSellers : [] }  }}
      case 'SET_DELETED_SELLERS': 
        return{...state, userManagment: {...state.userManagment , tempStates : {...state.userManagment.tempStates , deletedSellers : action.payload }  }}
      case 'GET_ALL_PRODUCTS_FOR_ADMIN':
        return{...state, productManagement: {...state.productManagement , products : action.payload}}
      case 'PRODUCTS_TABLE_ERROR_TRUE':
        return{...state , productManagement: {...state.productManagement , productsTableError : true } }
      case 'PRODUCTS_TABLE_ERROR_FALSE':
        return{...state, productManagement: {...state.productManagement , productsTableError : false} }
      case 'SET_SELECTED_PRODUCTS':
        return{...state, productManagement: {...state.productManagement , tempStates : {...state.productManagement.tempStates , selectedProducts : action.payload } } }
      case 'UPDATE_PRODUCTS_BY_ADMIN':
        return{...state, productManagement: {...state.productManagement , products : action.payload }}
      case 'EMPTY_SELECTED_PRODUCTS':
        return{...state , productManagement:{...state.productManagement , tempStates : {...state.productManagement.tempStates , selectedProducts: [] }} }
      case 'PRODUCTS_DELETED_TABLE_ERROR_TRUE':
        return{...state , productManagement:{...state.productManagement, deletedProductsTableError: true } }
      case 'GET_ALL_DELETED_PRODUCTS_FOR_ADMIN':
        return{...state , productManagement:{...state.productManagement , deletedProducts : action.payload }}
      case 'PRODUCTS_DELETED_TABLE_ERROR_FALSE':
        return{...state , productManagement:{...state.productManagement, deletedProductsTableError: false } }
      case 'UPDATE_DELETED_PRODUCTS_BY_ADMIN':
        return{...state , productManagement:{...state.productManagement , deletedProducts : action.payload }}
      case 'SET_SELECTED_DELETED_PRODUCTS':
        return{...state , productManagement:{...state.productManagement , tempStates : {...state.productManagement.tempStates , selectedDeletedProducts : action.payload }}}
      case 'SET_SELECTED_DELETED_PRODUCTS':
        return{...state , productManagement:{...state.productManagement , tempStates : {...state.productManagement.tempStates , selectedDeletedProducts : [] }}}
      case 'SET_ADD_PRODUCT_TITLE':
        return{...state , addSingleProduct:{...state.addSingleProduct, title: action.payload }}
      case 'SET_ADD_PRODUCT_CATEGORY':
        return{...state , addSingleProduct:{...state.addSingleProduct, category: action.payload } }
      case 'SET_ADD_PRODUCT_DESCRIPTION':
        return{...state , addSingleProduct:{...state.addSingleProduct, description: action.payload }}
      case 'SET_ADD_PRODUCT_PRICE':
        return{...state, addSingleProduct:{...state.addSingleProduct, price: Number(action.payload) } }
      case 'SET_ADD_PRODUCT_IMAGE':
        return{...state, addSingleProduct:{...state.addSingleProduct, image : action.payload}}
      case 'SET_ADD_PRODUCT_EMPTY':
        return{...state, addSingleProduct:{...state.addSingleProduct, title : '', category : '', description: '', price : '', image :''}}
      case 'MAKE_CUSTOMER_ACCOUNT_TRUE':
        localStorage.setItem('loginAccountPage' , 'customerAccount' )
        return{...state , navbar : {...state.navbar , customerAccount : true}}
      case 'MAKE_SELLER_ACCOUNT_TRUE':
        localStorage.setItem('loginAccountPage' , 'sellerAccount' )
        return{...state , navbar : {...state.navbar , sellerAccount : true }}
      case 'MAKE_ACCOUNT_FALSE':
        localStorage.setItem('loginAccountPage' , 'none' )
        localStorage.setItem('userName' , 'Sign In' )
        return{...state , navbar : {...state.navbar , sellerAccount : false}}
      case 'MAKE_ADMIN_ACCOUNT_TRUE':
        localStorage.setItem('loginAccountPage' , 'adminAccount' )
        return{...state , navbar : {...state.navbar , adminAccount : true }}
      case 'MAKE_USER_NAME_NONE':
        localStorage.setItem('userName' , 'Sign In')
        return state
      case 'UNIQUE_ID_FOR_ORDER':
        localStorage.setItem('orderId' , action.payload)
        return{...state , localOrderId: action.payload }
      case 'GET_ORDERS_DATA_FOR_ADMIN':
        return{...state ,  ordersDataRef : action.payload }
      case 'GET_CANCEL_ORDERS_DATA_FOR_ADMIN':
        return{...state ,  cancelOrdersDataRef: action.payload }
      case 'EMPTY_CART_ITEMS':
        localStorage.setItem('cart' ,  JSON.stringify([]))
        localStorage.setItem('quantity' , 0 )
        localStorage.setItem('price' , 0)
        return{...state , localStorageCart: [] , localCartTotalQuantity: 0 , localCartTotalPrice : 0  }
      
        
      

    default:
      return state;
      break;
  }
};

export default ProductReducer;
