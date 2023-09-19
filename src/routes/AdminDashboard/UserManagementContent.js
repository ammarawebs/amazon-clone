import React from 'react'
import { useProductContext } from '../../context/ProductContext'
import Table from './Table'
import Button from '../../authentication/Button'

const UserManagementContent = () => {

    const {dispatch , userManagment,  deleteSelectedCustomers, deleteDeletedCustomers, deleteSelectedSellers, deleteDeletedSellers} = useProductContext()

    const customersColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 300},
        { field: 'firstname', headerName: 'First name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130  },
        
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstname || ''} ${params.row.lastname || ''}`,
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 130 }
      ];
  
      const sellerColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 300 },
        { field: 'firstname', headerName: 'First name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130 },
        
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstname || ''} ${params.row.lastname || ''}`,
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 130 },
        { field: 'phone', headerName: 'Phone', width: 180 },
        { field: 'bName', headerName: 'Business Name', width: 130 },
        { field: 'bDescription', headerName: 'Description', width: 200 },
        { field: 'city', headerName: 'City', width: 130 },
        { field: 'country', headerName: 'Country', width: 130 },
        { field: 'address', headerName: 'Address', width: 200 },
  
  
      ];



  return (
    <div className="user_management_content">
                <div className="user_management_customer">
                  <h1 className='user_management_customer_heading'>Customers</h1>
                  <div className="customer_table" style={{ height: 400, width: '100%' }}>
                  
                  <Table  
                  loading={(userManagment?.customers?.length === 0 && userManagment.customersTableError === true) || userManagment.customersTableError === true } 
                  
                  rows={userManagment.customers} columns={customersColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      
                      dispatch({type: 'SET_SELECTED_CUSTOMERS', payload : newRowSelectionModel })
                      
                    }}/>
                   { userManagment.tempStates.selectedCustomers.length !== 0 ? <Button onclick={deleteSelectedCustomers} title='Delete Selected Customers'/> : <></>
                   }
                   
                  </div>
                </div>

                <div className="user_management_deleted_customer">
                  <h1 className='user_management_customer_heading'> Deleted Customers</h1>
                  <div className="customer_table" style={{ height: 400, width: '100%' }}>
                  
                  <Table  
                  loading={(userManagment?.deletedCustomers?.length === 0 && userManagment.deletedCustomerError === true)  || userManagment.deletedCustomerError === true  } 
                  rows={userManagment.deletedCustomers} columns={customersColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      dispatch({type : 'SET_DELETED_CUSTOMERS' , payload :newRowSelectionModel })
                      
                    }}/>
                   { userManagment.tempStates.deletedCustomers.length !== 0 ? <Button onclick={deleteDeletedCustomers} title='Restore Selected Customers'/> : <></>
                   }
                   
                  </div>
                </div>
                
                <div className="user_management_sellers">
                  <h1 className='user_management_customer_heading'>Sellers</h1>
                  <div className="customer_table" style={{ height: 400, width: '100%' }}>
                  
                  <Table  
                  
                  loading={(userManagment?.sellers?.length === 0 && userManagment.sellersTableError === true) || userManagment.sellersTableError === true } 
                  rows={userManagment.sellers} columns={sellerColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      dispatch({type : 'SET_SELECTED_SELLERS' , payload :  newRowSelectionModel })
                      
                    }}/>


                   { userManagment.tempStates.selectedSellers.length !== 0 ? <Button onclick={deleteSelectedSellers} title='Delete Selected Sellers'/> : <></>
                   }
                  </div>

                </div>
                <div className="user_management_Deleted">
                  <h1 className='user_management_customer_heading'>Deleted Sellers</h1>
                  <div className="customer_table" style={{ height: 400, width: '100%' }}>
                  
                  <Table  
                  
                  loading={(userManagment?.deleteSellers?.length === 0 && userManagment.deletedSellersError === true) ||  userManagment.deletedSellersError === true } 
                  rows={userManagment.deleteSellers} columns={sellerColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      dispatch({type : 'SET_DELETED_SELLERS' , payload : newRowSelectionModel })
                      
                    }}/>


                   { userManagment.tempStates.deletedSellers.length !== 0 ? <Button onclick={deleteDeletedSellers} title='restore Selected Sellers'/> : <></>
                   }
                  </div>

                </div>

              </div>

  )
}

export default UserManagementContent