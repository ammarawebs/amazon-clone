import React from 'react'
import { TfiAlert } from "react-icons/tfi";
import { ImCheckmark } from "react-icons/im";


const ErrorBox = ({color, heading, msg}) => {
  return (
    <div className="login_error_box" style={{border : `1px solid ${color}` , boxShadow : `0 0 0 4px #fcf4f4 inset` }}>
          <div className='alert_icon' style={{color: color}}>
          {
            color === 'red' ? <TfiAlert size='30px'/> : color === 'green' ? <ImCheckmark size='30px'/> : <></>
          }
          </div>
          <div className="error_msg_div">
            <h1 className="login_error_heading" style={{color : color}}> 
                {heading}
            </h1>
            <p className="login_error_label">
              {msg}
            </p>
          </div>
          

        </div> 
  )
}

export default ErrorBox