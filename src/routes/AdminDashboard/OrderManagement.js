import * as React from 'react';
import { useProductContext } from '../../context/ProductContext';
import Button from '../../authentication/Button';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';





function DetailPanelContent({ row: rowProp }: { row: Customer }) {
    return (
      <Stack
        sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
        direction="column"
      >
        <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
          <Stack direction="column" spacing={1} sx={{ height: 1 }}>
            <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
            <Grid container>
              <Grid item md={6}>
                <Typography variant="body2" color="textSecondary">
                  Customer information
                </Typography>
                <Typography variant="body1">{rowProp.userData.firstname}</Typography>
                <Typography variant="body1">{rowProp.userData.email}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2" align="right" color="textSecondary">
                  Shipping address
                </Typography>
                <Typography variant="body1" align="right">
                  {/* {rowProp.address} */}
                  'lahore'
                </Typography>
                {/* <Typography variant="body1" align="right">{`${rowProp.city}, ${rowProp.country.label}`}</Typography> */}
              </Grid>
            </Grid>
            <DataGridPro 
              
              density="compact"
              columns={[
                { field: 'id', headerName: 'ID', flex: 1 },
                {
                  field: 'image',
                  headerName: 'Image',
                  width: 300,
                  height: 100,
                
                  renderCell: (params: GridValueGetterParams) => (
                    
                    <img
                      src={params.value } // Assuming the 'image' field contains the URL as a string
                      alt="Product Image"
                      style={{ width: 'auto', height: '30px', display: 'flex', mixBlendMode: 'multiply', alignItems : 'center'  }}
                    />
                  
                  ),
                  
                },
                { field: 'title', headerName: 'Product', flex: 1 },
                {
                  field: 'quantity',
                  headerName: 'Quantity',
                  align: 'center',
                  type: 'number',
                },
                
                {
                  field: 'price',
                  headerName: 'price',
                  type: 'number',
                  
                },
              ]}
              rows={rowProp.cartData}
              sx={{ flex: 1 }}
              hideFooter
            />
          </Stack>
        </Paper>
      </Stack>
    );
  }





  function DetailPanelContentCancel({ row: rowProp }: { row: Customer }) {
    return (
      <Stack
        sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
        direction="column"
      >
        <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
          <Stack direction="column" spacing={1} sx={{ height: 1 }}>
            <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
            <Grid container>
              <Grid item md={6}>
                <Typography variant="body2" color="textSecondary">
                  Customer information
                </Typography>
                <Typography variant="body1">{rowProp.userData.firstname}</Typography>
                <Typography variant="body1">{rowProp.userData.email}</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="body2" align="right" color="textSecondary">
                  Shipping address
                </Typography>
                <Typography variant="body1" align="right">
                  {/* {rowProp.address} */}
                  'lahore'
                </Typography>
                {/* <Typography variant="body1" align="right">{`${rowProp.city}, ${rowProp.country.label}`}</Typography> */}
              </Grid>
            </Grid>
            <DataGridPro 
              
              density="compact"
              columns={[
                { field: 'id', headerName: 'ID', flex: 1 },
                {
                  field: 'image',
                  headerName: 'Image',
                  width: 300,
                  height: 100,
                
                  renderCell: (params: GridValueGetterParams) => (
                    
                    <img
                      src={params.value } // Assuming the 'image' field contains the URL as a string
                      alt="Product Image"
                      style={{ width: 'auto', height: '30px', display: 'flex', mixBlendMode: 'multiply', alignItems : 'center'  }}
                    />
                  
                  ),
                  
                },
                { field: 'title', headerName: 'Product', flex: 1 },
                {
                  field: 'quantity',
                  headerName: 'Quantity',
                  align: 'center',
                  type: 'number',
                },
                
                {
                  field: 'price',
                  headerName: 'price',
                  type: 'number',
                  
                },
              ]}
              rows={rowProp.cartData}
              sx={{ flex: 1 }}
              hideFooter
            />
          </Stack>
        </Paper>
      </Stack>
    );
  }


  

   const OrderManagement = ()=>  {

    const { ordersDataRef , getOrdersDataforAdmin , cancelOrdersDataRef , getCancelOrdersDataforAdmin} = useProductContext()

   


    const columns: GridColDef[] = [
        { field: 'orderId', headerName: 'Order ID',  width: 300 },
        
        { field: 'user', headerName: 'Customer', width: 200, 
         valueGetter: (params: GridValueGetterParams) =>
        `${params.row.userData.firstname}`, },
        { field: 'date',  headerName: 'Placed at' },
        { field: 'time', headerName: 'Time' },
        {
          field: 'totalBill',
          type: 'number',
          headerName: 'Total',
        },
      ];

      // const cancelcolumns: GridColDef[] = [
      //   { field: 'orderId', headerName: 'Order ID',  width: 300 },
        
      //   { field: 'user', headerName: 'Customer', width: 200, 
      //    valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.userData.firstname}`, },
      //   { field: 'date',  headerName: 'Placed at' },
      //   { field: 'time', headerName: 'Time' },
      //   {
      //     field: 'totalBill',
      //     type: 'number',
      //     headerName: 'Total',
      //   },
      // ];

    

    console.log(ordersDataRef)

    const getDetailPanelContent = React.useCallback(function ({ row }) {
        return <DetailPanelContent row={row}  />;
      }, []);

  const getDetailPanelHeight = React.useCallback(() => 400, []);



  const getDetailPanelContentCancel = React.useCallback(function ({ row }) {
    return <DetailPanelContentCancel row={row}  />;
  }, []);

const getDetailPanelHeightCancel = React.useCallback(() => 400, []);

  React.useEffect(()=>{
    getOrdersDataforAdmin()
    getCancelOrdersDataforAdmin()
  }, [])

    
  return (
    <div className="orderManagement_main">
        
            <h1>Order Management</h1>
            <br/>
            <br/>
            <h2>Completed Orders</h2>
            <br/>
            <Box sx={{ width: '100%', height: 500 }}>
            <DataGridPro
                columns={columns}
                slots={{
                        loadingOverlay: LinearProgress,
                      }}
                loading={ordersDataRef.length == 0}
                rows={ordersDataRef}
                rowThreshold={0}
               
                getDetailPanelHeight={getDetailPanelHeight}
                getDetailPanelContent={getDetailPanelContent}
                style={{
                        borderRadius: '10px',
                        padding: '30px',
                        backgroundColor: 'white',
                        color: 'black',
                        boxShadow: '1px 1px 30px rgba(0,0,0,0.1)',
                      
                      }}
            />
            </Box>


            <br/>
            <br/>
            <h2>Canceled Orders</h2>
            <br/>
            <Box sx={{ width: '100%', height: 500 }}>
            <DataGridPro
                columns={columns}
                slots={{
                        loadingOverlay: LinearProgress,
                      }}
                loading={cancelOrdersDataRef.length == 0}
                rows={cancelOrdersDataRef}
                rowThreshold={0}
               
                getDetailPanelHeight={getDetailPanelHeightCancel}
                getDetailPanelContent={getDetailPanelContentCancel}
                style={{
                        borderRadius: '10px',
                        padding: '30px',
                        backgroundColor: 'white',
                        color: 'black',
                        boxShadow: '1px 1px 30px rgba(0,0,0,0.1)',
                      
                      }}
            />
            </Box>
            
            
            
       
    </div>
  )
}

export default OrderManagement