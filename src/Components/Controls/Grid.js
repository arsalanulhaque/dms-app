import React, { useEffect, useState, useContext, useRef } from 'react';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import FetchData from '../../Hooks/FetchData'
import SessionContext from '../../Context/SessionContext'

const Grid = (props) => {
  const { session } = useContext(SessionContext);

  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [apiResponse, setApiResponse] = useState('')
  const permissions = useRef({ create: false, update: false, delete: false, retrieve: false })

  const handleDeleteClick = (id) => () => {
    let endpoint = ''
    let body = {}
    switch (window.location.pathname) {
      case '/manageschools':
        endpoint = 'http://beyghairat.admee.co.uk:8000/school'
        body = { "SchoolID": id }
        break;
      case '/managedevices':
        endpoint = 'http://beyghairat.admee.co.uk:8000/device'
        body = { "DeviceID": id }
        break;
      case '/managepreviliges':
        endpoint = 'http://beyghairat.admee.co.uk:8000/previlige'
        body = { "PreviligeID": id }
        break;
      case '/manageusers':
        endpoint = 'http://beyghairat.admee.co.uk:8000/users'
        body = { "UserID": id }
        break;
      default:
        break;
    }

    FetchData(endpoint, 'delete', body, (result) => {
      setApiResponse(result)
    })
  }

  const addActionCols = (params) => {
    let gridActionCols = []
    if (permissions.current.update) {
      gridActionCols.push(<GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => { props.editRow(params) }}
      />)
    }
    if (permissions.current.delete) {
      gridActionCols.push(
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(params.id)}
        />)
    }
    return gridActionCols
  }
  useEffect(() => {


    session.data.map((item) => {
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
          obj.id = obj?.DeviceID || obj?.DeviceStatusID || obj?.PreviligeID || obj?.SchoolID || obj?.UserID
        })

        if (result?.data?.length > 0) {
          let _columns = []
          let keys = Object.keys(result.data[0])
          keys.map((key, index) => {
            if (index > 0 && key === 'id')
              return

            let temp = {
              field: index === 0 ? 'id' : key,
            }

            switch (key) {
              case 'UserID':
              case 'DeviceID':
              case 'SchoolID':
              case 'DeviceStatusID':
              case 'PreviligeID':
                temp.headerName = 'ID'
                temp.width = 70
                break;
              case 'SchoolName':
                temp.headerName = 'School Name'
                temp.width = 350
                break;
              case 'Username':
                temp.headerName = 'User Name'
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
              case 'UserPreviligeID':
                temp.headerName = 'UserPreviligeID'
                temp.width = 1
                break;
            }

            _columns.push(temp)
          })

          if (window.location.pathname === '/managedevicestatus') {

          } else {

            _columns.push(
              {
                field: 'actions',
                headerName: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => addActionCols(params)
              }
            )
          }
          setRows(result.data)
          setColumns(_columns)
        }
      }
    })
  }, [props.api])
  return (
    <Box>
      <Box display="flex" height={600} marginTop={3} >
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                UserPreviligeID: false,
                UserSchoolID: false,
              },
            },
          }}
          rows={rows}
          columns={columns}
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
      {apiResponse}
    </Box >
  )
}
export default Grid