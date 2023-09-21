import React from 'react';
import Button from '../../authentication/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const Table = ({ loading, rows, columns, onRowSelectionModelChange, rowHeight }) => {
  // Define a custom function to calculate row height (e.g., set to 40px)
  const getRowHeight = (params) => {
    return Number(rowHeight); // Adjust the height as needed
  };

  return (
    <>
      <DataGrid
        slots={{
          loadingOverlay: LinearProgress,
        }}
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 7 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection  
        onRowSelectionModelChange={onRowSelectionModelChange}
        style={{
          borderRadius: '10px',
          padding: '30px',
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '1px 1px 30px rgba(0,0,0,0.1)',
        }}
        // Pass the custom getRowHeight function
        getRowHeight={getRowHeight}
      />
    </>
  );
};

export default Table;
