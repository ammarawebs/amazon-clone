import React from 'react'
import { Link } from 'react-router-dom'

const Link_text = ({title, color, padding , margin ,fontSize , link}) => {
  return (
    <>
        <Link to={link}><p  style={{color, padding, margin , fontSize}}>{title}</p></Link>
    </>
  )
}

export default Link_text