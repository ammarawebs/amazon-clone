import * as React from 'react';
import { useProductContext } from '../../context/ProductContext';
import Button from '../../authentication/Button';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomPrice,
  randomCurrency,
  randomCountry,
  randomCity,
  randomEmail,
  randomInt,
  randomAddress,
  randomCommodity,
} from '@mui/x-data-grid-generator';




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
                { field: 'title', headerName: 'Product', flex: 1 },
                {
                  field: 'quantity',
                  headerName: 'Quantity',
                  align: 'center',
                  type: 'number',
                },
                
                {
                  field: 'price',
                  headerName: 'Total',
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

  type Customer = (typeof ordersDataRef)[number];

  

   const OrderManagement = ()=>  {

    const { ordersDataRef  } = useProductContext()

   


    const columns: GridColDef[] = [
        { field: 'orderId', headerName: 'Order ID' },
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

    

    console.log(ordersDataRef)

    const getDetailPanelContent = React.useCallback(function ({ row }) {
        return <DetailPanelContent row={row} />;
      }, []);

  const getDetailPanelHeight = React.useCallback(() => 400, []);

    
  return (
    <div className="orderManagement_main">
        
            <h1>Order Management</h1>
            <br/>
            <br/>

            <Box sx={{ width: '100%', height: 400 }}>
            <DataGridPro
                columns={columns}
                rows={ordersDataRef}
                rowThreshold={0}
               
                getDetailPanelHeight={getDetailPanelHeight}
                getDetailPanelContent={getDetailPanelContent}
            />
            </Box>
            
            
            
       
    </div>
  )
}

export default OrderManagement