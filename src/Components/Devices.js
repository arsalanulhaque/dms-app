import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import Dropdown from './Controls/Dropdown';
import DeviceIU from './DeviceIU';
import Alert from 'react-bootstrap/Alert';
import useSession from '../Context/SessionContext'

function Devices() {
    const [getSession] = useSession()
    const isAppDeveloper = getSession()?.isAppDeveloper === true
    const [editRow, setEditRow] = useState({})
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [reloadGrid, setReload] = useState(false)
    // -1 means "All schools" (default for Super Admin); otherwise filter to that school.
    const [filterSchoolID, setFilterSchoolID] = useState(-1)

    const editRowAction = (params) => {
        setEditRow(params.row)
        setReload(false)
    }

    const handleModalOpen = (isOpen) => {
        if (isOpen)
            setReload(false)

    }

    const handleModalClosed = (message, alertType, isClosed) => {
        if (isClosed) {
            setEditRow(null)
            setMessage(message)
            setAlertType(alertType)
            setReload(true)
        }
    }

    const handleRowDelete = (message, alertType) => {
        setMessage(message)
        setAlertType(alertType)
        setReload(true)
    }

    // Resolve which devices endpoint the grid should hit:
    // - School users always see their own school's devices.
    // - Super Admin sees all by default, or a specific school when one is selected.
    const gridApi = isAppDeveloper
        ? (filterSchoolID > 0 ? `device/${filterSchoolID}` : 'device')
        : `device/${getSession()?.schoolID}`

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">

                <section className="section">
                    <div className="card">
                        <div className="card-header">
                            <div className='row mb-2'>
                                <div className='col'>
                                    <div className="pagetitle">
                                        <h1>Manage Devices</h1>
                                    </div>
                                </div>
                                <div className='col'>
                                    <DeviceIU editRow={editRow} handleModalClosed={handleModalClosed} handleModalOpen={handleModalOpen} />
                                </div>
                            </div>
                            {isAppDeveloper && (
                                <div className='row mb-2'>
                                    <div className='col-md-6 col-lg-4'>
                                        <label htmlFor="schoolFilter" className='form-label mb-1'>Filter by School</label>
                                        <Dropdown
                                            name="schoolFilter"
                                            api="school"
                                            keyField='SchoolID'
                                            valueField='SchoolName'
                                            selectedValue={filterSchoolID}
                                            onChange={(value) => setFilterSchoolID(value?.value ?? -1)}
                                        />
                                        <small className='text-muted'>Select a school to view only its devices, or leave as "Select" to view all.</small>
                                    </div>
                                </div>
                            )}
                            <Alert className='m-0 p-2' key={alertType} variant={alertType}>
                                {message}
                            </Alert>
                        </div>
                        <div className="card-body">
                            <Grid api={gridApi} editRow={editRowAction} deleteRow={handleRowDelete} reload={reloadGrid} />
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default Devices;