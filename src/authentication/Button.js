import React from 'react'

const Button = ({type, title, width , onclick}) => {
  return (
    <>
        <button onClick={onclick} type={type} className='auth_sign_up_button' style={{width}} >{title}</button>
    </>
  )
}

export default Button