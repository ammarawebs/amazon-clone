import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import {storage} from '../../config/firebase-config'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { v4 } from "uuid";
import Button from "../../authentication/Button";
import Loader from "../../authentication/Loader";


const SingleProductEdit = () => {
  const { dispatch , getSingleProduct, singleProduct, isSinlgleLoading, singleProductEdited } = useProductContext();
  const { id } = useParams();
  const { category, description, image , price, rating, title  } = singleProduct;

  useEffect(()=>{
    getSingleProduct(id)
  }, [])


  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Create a reference to the Firebase Storage location where you want to upload the image
      const storageRef = ref(storage, `product-images/${v4()}`); // Use a unique name for each upload
      dispatch({ type: 'SET_SINGLE_LOADING' });

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Update the state with the Firebase Storage URL
        dispatch({ type: 'SET_SINGLE_PRODUCT_IMAGE', payload: downloadURL });
        dispatch({ type: 'SET_SINGLE_LOADING_FALSE'})
      } catch (error) {
        console.error("Error uploading image to Firebase Storage: ", error);
      }
    }
  };

  return (
    
      <div className="single_product_edit_main_content">
        <h1 className="single_product_edit_main_content_heading">You are editing product number {id}</h1>

        

        <label htmlFor="auth_fname" className="single_product_edit_label">
          Title
        </label>
        <input type="text" id="auth_fname" className="auth_input" value={title} placeholder={title} onChange={(e)=>dispatch({ type : 'SET_SINGLE_PRODUCT_TITLE' , payload : e.target.value })}/>
        <label htmlFor="auth_fname" className="single_product_edit_label">
          Category
        </label>
        <input type="text" id="auth_fname" className="auth_input" value={category} placeholder={category} onChange={(e)=>dispatch({ type : 'SET_SINGLE_PRODUCT_CATEGORY' , payload : e.target.value })}/>
        <label htmlFor="auth_fname" className="single_product_edit_label">
          Description
        </label>
        <textarea rows='8' type="text" id="auth_fname" className="auth_input" value={description} placeholder={description} onChange={(e)=>dispatch({ type : 'SET_SINGLE_PRODUCT_DESCRIPTION' , payload : e.target.value })}/>


        <label htmlFor="auth_fname" className="single_product_edit_label">
          Price
        </label>
        <input type="number" id="auth_fname" className="auth_input" value={price} placeholder={price} onChange={(e)=>dispatch({ type : 'SET_SINGLE_PRODUCT_PRICE' , payload : e.target.value })}/>

        <label htmlFor="auth_fname" className="single_product_edit_label">
          image
        </label>
        <div className="single_product_image_edit">
        { isSinlgleLoading? <Loader size='30px'/> : <img src={image} alt="" style={{height: 'auto', width: '200px'}}  />}
        </div>
        
        <input type="file" id="auth_fname" className="auth_input" onChange={handleImageChange}/>

        <Button title={isSinlgleLoading? <div style={{height: '20px', width: '100%' , display: "flex" , justifyContent: 'center'}}><Loader size='20px' width='20px' height='20px'/></div>: 'Update Product'} type='button' onclick={()=>singleProductEdited(id)} />

        
       

     
      </div>
    
  );
};

export default SingleProductEdit;
