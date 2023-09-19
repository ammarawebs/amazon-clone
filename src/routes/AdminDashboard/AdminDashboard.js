import React from 'react'
import { useProductContext } from '../../context/ProductContext';
import AdminSidebar from './AdminSidebar';
import UserManagementContent from './UserManagementContent';
import { Outlet } from 'react-router-dom';







const AdminDashboard = () => {


  const {dispatch} = useProductContext()


  return (
    <>
        <div className="admin_main">
          <div className="admin_second_main">
            <AdminSidebar/>
            <div className="admin_content_section">
              <h1 className='admin_content_section_heading'>Welcome Admin</h1>
              {/* <UserManagementContent/> */}
              <Outlet />              
            </div>
          </div>
        </div>
    </>
  )
}

export default AdminDashboard