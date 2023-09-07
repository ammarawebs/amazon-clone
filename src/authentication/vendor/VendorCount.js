import React from 'react'
import { useProductContext } from '../../context/ProductContext'



const VendorCount = ({count, title ,style, dispatchMethod}) => {

    const {dispatch} = useProductContext()

    


  return (
    <div className="vendorCount">
                    <button onClick={()=>dispatch({type : dispatchMethod })} className="vendorSectionNumber" style={style}>
                        <h1>{count}</h1>
                    </button>
                    <h1 className="vendsorSectionTitle">
                        {title}
                    </h1>
                    <hr />
                </div>
  )
}

export default VendorCount