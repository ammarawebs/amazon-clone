import React from 'react'
import Link_text from '../../authentication/Link_text'
import Logo from '../../components/Logo'

const AdminSidebar = () => {
  return (
        <div className="admin_sidebar">

              <Logo/>

              <div className="admin_sidebar_navbar">
                <Link_text link='/admin-dashboard/user-management' title='User Management' color='white' />
                <Link_text link='/admin-dashboard/product-management' title='Product Management' color='white' />
                <Link_text link='/admin-dashboard/add-product' title='Add New Product' color='white' />
                <Link_text link='/admin-dashboard/order-management' title='Order Management' color='white' />

              </div>

              <div className='admin_logout_section'>
              <button className='admin_logout_button'>
                <Link_text title='log out' color='white' /> 
              </button> 
              </div>
              
            </div>
  )
}

export default AdminSidebar