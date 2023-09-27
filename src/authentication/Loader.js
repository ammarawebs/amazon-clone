import React from 'react'
import { AiOutlineLoading } from "react-icons/ai";

const Loader = ({marginTop , size , width , height }) => {
  return (
    <div className='loading_icon' style={{marginTop , width , height}}><AiOutlineLoading size={size} /></div> 
  )
}

export default Loader