import React, { useEffect } from 'react'
import Button from '../../authentication/Button'
import { useProductContext } from '../../context/ProductContext'
import { Link } from 'react-router-dom'
import Table from './Table'


const ProductManagement = () => {


    const {dispatch, getProductsForAdmin ,productManagement , getAllProductsForAdmin, handleEditProductClick, deleteSelectedProducts, getProductsStatus, getAllDeletedProductsForAdmin, deleteDeletedProducts } = useProductContext()
    

    

    const productsColumns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 120 },
      {
        field: 'image',
        headerName: 'Image',
        width: 300,
      
        renderCell: (params: GridValueGetterParams) => (
          
          <img
            src={params.value } // Assuming the 'image' field contains the URL as a string
            alt="Product Image"
            style={{ width: 'auto', height: '80px', display: 'flex', mixBlendMode: 'multiply', alignItems : 'center'  }}
          />
        
        ),
      },
      { field: 'title', headerName: 'Title', width: 200 },
      { field: 'price', headerName: 'Price', width: 130 },
      { field: 'category', headerName: 'Category', width: 200 },
      { field: 'description', headerName: 'Description', width: 300 },
      {
        field: 'reviews',
        headerName: 'Reviews',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.rating.count || ''}`,
      },
      {
        field: 'rating',
        headerName: 'Rating',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.rating.rate || ''}`,
      },
      // Add a new column for the edit button
      {
        field: 'edit',
        headerName: 'Edit',
        sortable: false,
        width: 100,
        renderCell: (params: GridValueGetterParams) => (
          <Link to={`/admin-dashboard/edit-product/${params.row.id}`} style={{width : '100%'}}><Button
            onclick={() => handleEditProductClick(params.row.id)} // You can pass the ID or any relevant data for editing
            title='Edit'
          />
          </Link>

          
        ),
      },
    ];

    useEffect(()=>{
      getAllProductsForAdmin()
      getAllDeletedProductsForAdmin()
    }, [])



  return (
    <>
        <div className="product_management_content">
            <h1>Product Management</h1>
            
            <div className="product_management_table">
                  <h1 className='product_management_table_heading'>All Products</h1>
                  <div className="product_table" style={{ height: 600, width: '100%'  }}>
                  
                  <Table  
                  loading={(productManagement?.products?.length === 0 && productManagement.productsTableError === true) || productManagement.productsTableError === true } 
                  
                  rows={productManagement.products} columns={productsColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      
                      dispatch({type: 'SET_SELECTED_PRODUCTS', payload : newRowSelectionModel })
                      
                    }} rowHeight='100'/>
                   { productManagement.tempStates.selectedProducts.length !== 0 ? <Button onclick={deleteSelectedProducts} title='Delete Selected Customers'/> : <></>
                   }
                   
                  </div>
                </div>

                <div className="deleted_product_table">
                  <h1 className='product_management_table_heading'>All Deleted Products</h1>
                  <div className="product_table" style={{ height: 600, width: '100%'  }}>
                  
                  <Table  
                  loading={(productManagement?.deletedProducts?.length === 0 && productManagement.deletedProductsTableError === true) || productManagement.deletedProductsTableError === true } 
                  
                  rows={productManagement.deletedProducts} columns={productsColumns}   onRowSelectionModelChange={(newRowSelectionModel) => {
                      console.log(newRowSelectionModel)
                      
                      dispatch({type: 'SET_SELECTED_DELETED_PRODUCTS', payload : newRowSelectionModel })
                      
                    }} rowHeight='100'/>
                   { productManagement.tempStates.selectedDeletedProducts.length !== 0 ? <Button onclick={deleteDeletedProducts} title='Restore Selected Customers'/> : <></>
                   }
                   
                  </div>
                </div>
                
        </div>

        
        
    </>
  )
}

export default ProductManagement