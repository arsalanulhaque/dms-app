import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Paper, Typography } from '@mui/material';
import FetchData from '../../Hooks/FetchData';
import useSession from '../../Context/SessionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfirmModal from '../SharedComponents/ConfirmModal';

const customGridStyles = {
  '& .MuiDataGrid-root': {
    border: 'none',
    backgroundColor: '#fff',
  },
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-within': {
      outline: 'none',
    }
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#fff',
    borderBottom: 'none',
    '& .MuiDataGrid-columnHeader': {
      '&:focus': {
        outline: 'none',
      },
      '&:focus-within': {
        outline: 'none',
      }
    }
  },
  '& .MuiDataGrid-columnHeader': {
    padding: '16px',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
    color: '#666',
  },
  '& .MuiDataGrid-row': {
    '&:hover': {
      backgroundColor: '#fafafa',
    },
    '&.Mui-selected': {
      backgroundColor: '#f5f5f5',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
    backgroundColor: '#fff',
  },
  '& .MuiDataGrid-toolbarContainer': {
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: 'none',
  },
  '& .MuiButton-root': {
    textTransform: 'none',
    fontWeight: 500,
    color: '#666',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: '#fff',
  },
  '& .MuiDataGrid-overlay': {
    backgroundColor: '#fff',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  }
};

const CustomToolbar = () => (
  <Box sx={{ 
    p: 2, 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 'none'
  }}>
    <GridToolbar 
      sx={{
        '& .MuiButton-root': {
          color: '#666',
          mx: 0.5,
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      }}
    />
  </Box>
);

const Grid = (props) => {
  const [getSession] = useSession();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const permissions = useRef({ create: false, update: false, delete: false, retrieve: false });
  const [reloadGrid, setReload] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(-1);
  const [confirmationMesssage, setConfirmationMessage] = useState(-1);

  const handleConfirmModalClose = () => {
    setConfirmModal(false);
    setIdToDelete(-1);
    setConfirmationMessage(null);
  };

  const handleConfirmModalConfirm = () => {
    deleteRow(IdToDelete);
    handleConfirmModalClose();
  };

  const handleDeleteClick = (row) => () => {
    setConfirmModal(true);
    if (row?.row?.IsIssued) {
      if (row?.row?.IsIssued === 1) {
        setIdToDelete(-1);
        setConfirmationMessage(`Device with ID: ${row.id} is issued and you can't delete this device before return!`);
      }
    } else {
      setIdToDelete(row.id);
      setConfirmationMessage(`Are you sure you want to delete record with ID: ${row.id}?`);
    }
  };

  const deleteRow = (id) => {
    setReload(false);
    let endpoint = '';
    let body = {};
    switch (window.location.pathname) {
      case '/manageschools':
        endpoint = 'school';
        body = { "SchoolID": id };
        break;
      case '/managedevices':
        endpoint = 'device';
        body = { "DeviceID": id };
        break;
      case '/managepreviliges':
        endpoint = 'previlige';
        body = { "PreviligeID": id };
        break;
      case '/manageusers':
        endpoint = 'users';
        body = { "UserID": id };
        break;
      case '/manageactions':
        endpoint = 'actions';
        body = { "ActionID": id };
        break;
      case '/managemenus':
        endpoint = 'menus';
        body = { "MenuID": id };
        break;
      case '/managepolicies':
        endpoint = 'policy';
        body = { "PreviligeMenuActionsID": id };
        break;
      default:
        break;
    }

    FetchData(endpoint, 'delete', body, (result) => {
      props.deleteRow(result, 'success');
    });
  };

  const addActionCols = useCallback((params) => {
    const actions = [];
    
    if (permissions.current.update) {
      actions.push(
        <GridActionsCellItem
          icon={<EditIcon sx={{ color: '#ffa726' }} />}
          label="Edit"
          onClick={() => props.editRow(params)}
          showInMenu={false}
        />
      );
    }
    
    if (permissions.current.delete) {
      actions.push(
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: '#ef5350' }} />}
          label="Delete"
          onClick={handleDeleteClick(params)}
          showInMenu={false}
        />
      );
    }

    return actions;
  }, [props.editRow]);

  const formatDate = (params) => {
    if (!params?.value) return '';
    try {
      const date = new Date(params.value);
      if (date instanceof Date && !isNaN(date)) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return '';
    } catch (error) {
      console.warn('Date parsing error:', error);
      return '';
    }
  };

  useEffect(() => {
    setReload(props.reload);
    getSession()?.data.forEach((item) => {
      if (item.Link === window.location.pathname) {
        switch (item.ActionName) {
          case 'Create':
            permissions.current.create = true;
            break;
          case 'Update':
            permissions.current.update = true;
            break;
          case 'Delete':
            permissions.current.delete = true;
            break;
          case 'Retrieve':
            permissions.current.retrieve = true;
            break;
          default:
            break;
        }
      }
    });

    FetchData(props.api, 'get', null, (result) => {
      if (result.error === false) {
        result.data.forEach(obj => {
          obj.id = obj?.DeviceID || obj?.DeviceStatusID || obj?.PreviligeID || obj?.SchoolID || obj?.UserID || obj?.PreviligeSchoolID || obj?.ActionID || obj?.MenuID || obj.PreviligeMenuActionsID;
        });

        if (result?.data?.length > 0) {
          let _columns = [];
          let keys = Object.keys(result.data[0]);

          if (getSession()?.isAppDeveloper === false) {
            let index = keys.findIndex(e => e.toLowerCase() === 'schoolname');
            if (index !== -1) {
              keys.splice(index, 1);
            }
          }

          keys.forEach((key, index) => {
            if (index > 0 && key === 'id') return;

            let temp = {
              field: index === 0 ? 'id' : key,
              resizable: true,
              flex: 1,
              minWidth: 100,
            };

            // Column configurations
            const columnConfig = {
              'ID': { width: 70 },
              'School Name': { minWidth: 200 },
              'URL': { minWidth: 250 },
              'Action Name': { minWidth: 150 },
              'User Name': { minWidth: 150 },
              'First Name': { minWidth: 150 },
              'Last Name': { minWidth: 150 },
              'Menu Name': { minWidth: 150 },
              'Address': { minWidth: 300 },
              'Role Name': { minWidth: 150 },
              'Device Name': { minWidth: 150 },
              'Email': { minWidth: 200 },
              'Issued On': { 
                minWidth: 150,
                valueFormatter: formatDate
              },
              'Returned On': { 
                minWidth: 150,
                valueFormatter: formatDate
              },
              'Admin?': { width: 100, type: 'boolean' },
              'Issued?': { width: 100, type: 'boolean' },
              'NFC ID': { minWidth: 150 },
              'Taken Over From': { minWidth: 200 }
            };

            // Set column properties based on key
            const headerMapping = {
              UserID: 'ID',
              DeviceID: 'ID',
              SchoolID: 'ID',
              DeviceStatusID: 'ID',
              PreviligeID: 'ID',
              PreviligeSchoolID: 'ID',
              ActionID: 'ID',
              MenuID: 'ID',
              PreviligeMenuActionsID: 'ID',
              SchoolName: 'School Name',
              URL: 'URL',
              ActionName: 'Action Name',
              Username: 'User Name',
              FirstName: 'First Name',
              LastName: 'Last Name',
              MenuName: 'Menu Name',
              Address: 'Address',
              PreviligeName: 'Role Name',
              DeviceName: 'Device Name',
              EmailID: 'Email',
              IssuedDate: 'Issued On',
              ReturnDate: 'Returned On',
              IsAdmin: 'Admin?',
              IsIssued: 'Issued?',
              NfcID: 'NFC ID',
              TransferredFrom: 'Taken Over From'
            };

            const headerName = headerMapping[key];
            if (headerName) {
              temp.headerName = headerName;
              Object.assign(temp, columnConfig[headerName]);
            }

            _columns.push(temp);
          });

          if (window.location.pathname !== '/managedevicestatus' && (permissions.current.update || permissions.current.delete)) {
            _columns.push({
              field: 'actions',
              headerName: 'Actions',
              type: 'actions',
              width: 120,
              getActions: addActionCols
            });
          }

          setRows(result.data);
          setColumns(_columns);
        }
      }
    });
  }, [props.api, props.reload, reloadGrid, addActionCols]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          height: 600, 
          width: '100%', 
          overflow: 'hidden', 
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)'
        }}
      >
        <ConfirmModal
          show={showConfirmModal}
          handleClose={handleConfirmModalClose}
          handleConfirm={handleConfirmModalConfirm}
          message={confirmationMesssage}
        />
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={customGridStyles}
          initialState={{
            columns: {
              columnVisibilityModel: {
                FKPreviligeID: false,
                FKPreviligeMenuID: false,
                FKPreviligeActionID: false,
                FKSchoolID: false,
                FKDeviceStatusID: false,
                FKDeviceID: false,
                FKUserID: false,
                Password: false,
              },
            },
            pagination: {
              paginationModel: { pageSize: 10 }
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          getRowClassName={(params) => 
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
      </Paper>
    </Box>
  );
};

export default Grid;