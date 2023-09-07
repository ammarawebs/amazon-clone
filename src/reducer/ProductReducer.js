

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
        isSinlgleLoading: false,
        singleProduct: action.payload,
      };
      break;
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
      const { cartItem } = state; // Destructure cartItem from state
      const productIndex = cartItem.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(productIndex);

      if (productIndex !== -1) {
        return {
          ...state,
          cartItem: cartItem.map((item, index) => {
            if (index === productIndex) {
                const itemprice = item.price + action.payload.price
                const limitedItemPrice = itemprice.toFixed(2)
                const limitedItemPriceNumber = parseFloat(limitedItemPrice)
              return { ...item, quantity: item.quantity + 1 , price : limitedItemPriceNumber };
            }
            return item;
          }),
        };
      } else {
        return {
          ...state,
          cartItem: [...cartItem, { ...action.payload, quantity: 1   }],
        };
      }
      // No need for 'break' after return
      break;

    case "CART_ITEM_INCREAMENT":
      const productIncreamenttIndex = state.cartItem.findIndex(
        (item) => item.id === action.payload.item.id
      );
      console.log(productIncreamenttIndex);
      return {
        ...state,
        cartItem: state.cartItem.map((item, index) => {
          if (index === productIncreamenttIndex) {
            const incPrice = item.price + action.payload.product.price
            const limitedIncPrice = incPrice.toFixed(2)
            const limitedIncPriceNumber = parseFloat(limitedIncPrice)
            return { ...item, quantity: item.quantity + 1 , price : limitedIncPriceNumber };
          }
          return item;
        }),
      };

      case "CART_ITEM_DECREAMENT":
        const productDecrementIndex = state.cartItem.findIndex(
          (item) => item.id === action.payload.item.id
        );
      
        if (productDecrementIndex === -1) {
          return state; // Item not found, return the current state
        }
      
        const updatedCartItem = state.cartItem
          .map((item, index) => {
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
      
        const newTotalQuantity = updatedCartItem.reduce((total, item) => total + item.quantity, 0);
        const newTotalPrice = updatedCartItem.reduce((total, item) => total + item.price * item.quantity, 0);
      
        return {
          ...state,
          cartItem: updatedCartItem,
          totalQuantity: newTotalQuantity,
          totalPrice: newTotalPrice,
        };

      case 'TOTAL_QUANTITY_PRICE':
        if (state.cartItem.length > 0) {
          const updatedCartItems = state.cartItem.map((item) => ({
            ...item, // Keep the existing item properties
          }));
      
          let totalQuantity = 0;
          let totalPrice = 0;
      
          updatedCartItems.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.price;
          });

          
          const limitedTotalPrice = totalPrice.toFixed(2)

      
          return {
            ...state,
            cartItem: updatedCartItems,
            totalQuantity: totalQuantity,
            totalPrice: parseFloat(limitedTotalPrice),
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
        return {...state , currentUser : action.payload }
      case 'GOOGLE_SIGN_UP':
        return{...state , currentUser : action.payload}
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
      case 'INVALID_EMAIL':
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
        return{...state , vendorError : {...state.vendorError , business: action.payload } , vendorLoading : false }
      case 'VENDOR_REGISTER_USER':
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
      

      


        

    default:
      return state;
      break;
  }
};

export default ProductReducer;
