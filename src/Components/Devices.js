import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import DeviceIU from './DeviceIU';
import Alert from 'react-bootstrap/Alert';
import useSession from '../Context/SessionContext'

function Devices() {
    const [getSession, setSession] = useSession()
    const [editRow, setEditRow] = useState({})
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [reloadGrid, setReload] = useState(false)

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
                            <Alert className='m-0 p-2' key={alertType} variant={alertType}>
                                {message}
                            </Alert>
                        </div>
                        <div className="card-body">
                            <Grid api={getSession()?.isAppDeveloper === true ? `device` : `device/${getSession()?.schoolID}`} editRow={editRowAction} deleteRow={handleRowDelete} reload={reloadGrid} />
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default Devices;