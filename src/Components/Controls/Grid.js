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
  const [reloadGrid, setReload] = useState(false)

  const handleDeleteClick = (id) => () => {
    let endpoint = ''
    let body = {}
    switch (window.location.pathname) {
      case '/manageschools':
        endpoint = 'http://dms.admee.co.uk/school'
        body = { "SchoolID": id }
        break;
      case '/managedevices':
        endpoint = 'http://dms.admee.co.uk/device'
        body = { "DeviceID": id }
        break;
      case '/managepreviliges':
        endpoint = 'http://dms.admee.co.uk/previlige'
        body = { "PreviligeID": id }
        break;
      case '/manageusers':
        endpoint = 'http://dms.admee.co.uk/users'
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
        icon={<EditIcon sx={{ color: 'orange' }} />}
        label="Edit"
        onClick={() => { props.editRow(params) }}
      />)
    }
    if (permissions.current.delete) {
      gridActionCols.push(
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: 'red' }} />}
          label="Delete"
          onClick={handleDeleteClick(params.id)}
        />)
    }
    return gridActionCols
  }
  useEffect(() => {
    setReload(props.reload)

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

    if (rows?.length === 0 || props.reload === true) {
      FetchData(session.isSuperAdmin ? props.api : `${props.api}/${session.schoolID}`, 'get', null, (result) => {

        if (result.error === false) {
          result.data.map(obj => {
            obj.id = obj?.DeviceID || obj?.DeviceStatusID || obj?.PreviligeID || obj?.SchoolID || obj?.UserID || obj?.PreviligeSchoolID
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
                case 'PreviligeSchoolID':
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

            if (window.location.pathname !== '/managedevicestatus') {
              _columns.push(
                {
                  field: 'actions',
                  headerName: 'Actions',
                  type: 'actions',

                  flex: 1,
                  minWidth: 80,
                  align: "right",
                  headerAlign: 'right',

                  getActions: (params) => addActionCols(params)
                }
              )
            }
            setRows(result.data)
            setColumns(_columns)
          }
        }
      })
    }
  }, [props.api, props.reload])
  return (
    <Box>
      <Box display="flex" height={600} marginTop={3} >
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                FKPreviligeID: false,
                FKSchoolID: false,
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