import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import FetchData from '../../Hooks/FetchData'
import useSession from '../../Context/SessionContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfirmModal from '../SharedComponents/ConfirmModal';


const Grid = (props) => {
  const [getSession, setSession] = useSession()
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const permissions = useRef({ create: false, update: false, delete: false, retrieve: false })
  const [reloadGrid, setReload] = useState(false)
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [IdToDelete, setIdToDelete] = useState(-1);
  const [confirmationMesssage, setConfirmationMessage] = useState(-1);


  const handleConfirmModalClose = () => {
    setConfirmModal(false);
    setIdToDelete(-1)
    setConfirmationMessage(null)
  };

  const handleConfirmModalConfirm = () => {
    // Implement your deletion logic here
    deleteRow(IdToDelete);
    handleConfirmModalClose();
  };

  const handleDeleteClick = (row) => () => {
    setConfirmModal(true)
    if (row?.row?.IsIssued) {
      if (row?.row?.IsIssued === 1) {
        setIdToDelete(-1)
        setConfirmationMessage(`Device with ID: ${row.id} is issued and you can't delete this device before return!`)
      }
    } else {
      setIdToDelete(row.id)
      setConfirmationMessage(`Are you sure you want to delete record with ID: ${row.id}?`)
    }
  }

  const deleteRow = (id) => {
    setReload(false)
    let endpoint = ''
    let body = {}
    switch (window.location.pathname) {
      case '/manageschools':
        endpoint = 'school'
        body = { "SchoolID": id }
        break;
      case '/managedevices':
        endpoint = 'device'
        body = { "DeviceID": id }
        break;
      case '/managepreviliges':
        endpoint = 'previlige'
        body = { "PreviligeID": id }
        break;
      case '/manageusers':
        endpoint = 'users'
        body = { "UserID": id }
        break;
      case '/manageactions':
        endpoint = 'actions'
        body = { "ActionID": id }
        break;
      case '/managemenus':
        endpoint = 'menus'
        body = { "MenuID": id }
        break;
      case '/managepolicies':
        endpoint = 'policy'
        body = { "PreviligeMenuActionsID": id }
        break;
      default:
        break;
    }

    FetchData(endpoint, 'delete', body, (result) => {
      props.deleteRow(result, 'success')
    })
  }

  const addActionCols = useCallback((params) => {
    let gridActionCols = []
    if (permissions.current.update) {
      gridActionCols.push(<GridActionsCellItem
        icon={<EditIcon sx={{ color: 'orange' }} />}
        label="Edit"
        onClick={() => {
          props.editRow(params)
        }}
      />)
    }
    if (permissions.current.delete) {
      gridActionCols.push(
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: 'red' }} />}
          label="Delete"
          onClick={handleDeleteClick(params)}
        />)
    }
    return gridActionCols
  }, [])

  useEffect(() => {
    setReload(props.reload)
    getSession()?.data.map((item) => {
      if (item.Link === window.location.pathname) {
        switch (item.ActionName) {
          case 'Create':
            permissions.current.create = true
            break;
          case 'Update':
            permissions.current.update = true
            break;
          case 'Delete':
            permissions.current.delete = true
            break;
          case 'Retrieve':
            permissions.current.retrieve = true
            break;

          default:
            break;
        }
      }
    })

    FetchData(props.api, 'get', null, (result) => {

      if (result.error === false) {
        result.data.map(obj => {
          obj.id = obj?.DeviceID || obj?.DeviceStatusID || obj?.PreviligeID || obj?.SchoolID || obj?.UserID || obj?.PreviligeSchoolID || obj?.ActionID || obj?.MenuID || obj.PreviligeMenuActionsID
        })

        if (result?.data?.length > 0) {
          let _columns = []
          let keys = Object.keys(result.data[0])

          if (getSession()?.isAppDeveloper === false) {
            let index = keys.findIndex(e => e.toLowerCase() === 'schoolname')
            keys.splice(index, 1)
          }

          keys.map((key, index) => {
            if (index > 0 && key === 'id')
              return

            let temp = {
              field: index === 0 ? 'id' : key,
              resizable:true,
              
            }

            switch (key) {
              case 'UserID':
              case 'DeviceID':
              case 'SchoolID':
              case 'DeviceStatusID':
              case 'PreviligeID':
              case 'PreviligeSchoolID':
              case 'ActionID':
              case 'MenuID':
              case 'PreviligeMenuActionsID':
                temp.headerName = 'ID'
                temp.width = 70
                break;

              case 'SchoolName':
                temp.headerName = 'School Name'
                temp.width = 350
                break;
              case 'URL':
                temp.headerName = 'URL'
                temp.width = 350
                break;
              case 'ActionName':
                temp.headerName = 'Action Name'
                temp.width = 350
                break;
              case 'Username':
                temp.headerName = 'User Name'
                temp.width = 200
                break;
              case 'FirstName':
                temp.headerName = 'First Name'
                temp.width = 200
                break;
              case 'LastName':
                temp.headerName = 'Last Name'
                temp.width = 200
                break;
              case 'MenuName':
                temp.headerName = 'Menu Name'
                temp.width = 200
                break;
              case 'Address':
                temp.headerName = 'Address'
                temp.width = 650
                break;
              case 'PreviligeName':
                temp.headerName = 'Role Name'
                temp.width = 150
                break;
              case 'DeviceName':
                temp.headerName = 'Device Name'
                temp.width = 150
                break;
              case 'EmailID':
                temp.headerName = 'Email'
                temp.width = 250
                break;
              case 'IssuedDate':
                temp.headerName = 'Issued On'
                temp.width = 200
                break;
              case 'ReturnDate':
                temp.headerName = 'Returned On'
                temp.width = 200
                break;
              case 'IsAdmin':
                temp.headerName = 'Admin?'
                temp.type = "boolean"
                temp.width = 70
                break;
              case 'IsIssued':
                temp.headerName = 'Issued?'
                temp.type = "boolean"
                temp.width = 70
                break;
              case 'UserSchoolID':
                temp.headerName = 'UserSchoolID'
                temp.width = 1
                break;
              case 'NfcID':
                temp.headerName = 'NFC ID'
                temp.width = 200
                break;
              case 'UserPreviligeID':
                temp.headerName = 'UserPreviligeID'
                temp.width = 1
                break;
              case 'TransferredFrom':
                temp.headerName = 'Taken Over From'
                temp.width = 200
                break;

              default:
                break;
            }

            _columns.push(temp)
          })

          if (window.location.pathname !== '/managedevicestatus') {
            _columns.push({
              field: 'actions',
              headerName: 'Actions',
              type: 'actions',

              flex: 1,
              minWidth: 80,
              align: "right",
              headerAlign: 'right',

              getActions: (params) => addActionCols(params)
            })
          }
          setRows(result.data)
          setColumns(_columns)
        }
      }
    })

  }, [props.api, props.reload, reloadGrid, addActionCols, rows?.length,])
  return (
    <Box display="flex" height={600} marginTop={3} >
      <ConfirmModal
        show={showConfirmModal}
        handleClose={handleConfirmModalClose}
        handleConfirm={handleConfirmModalConfirm}
        message={confirmationMesssage}
      />
      <DataGrid
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
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
        }}
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          }}}
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  )
}
export default Grid