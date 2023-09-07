import React from 'react'
import { Link } from 'react-router-dom'

const Pagenavigation = ({title}) => {
  return (
    <>
        <div style={{margin: '50px 20px', fontSize : '15px'}}>
            <Link  to='/'>Home</Link>/{title}
        </div>
       
    </>
  )
}

export default Pagenavigation