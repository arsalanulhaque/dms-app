
import {  useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import UsersIU from './UsersIU'
import Alert from 'react-bootstrap/Alert';

function Users() {
    const [editRow, setEditRow] = useState({})
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')
    const [reloadGrid, setReload] = useState(false)

    const editRowAction = (params) => {
        setEditRow(params.row)
    }

    const handleModalClosed = (message, alertType, isClosed) => {
        if (isClosed) {
            setEditRow(null)
            setMessage(message)
            setAlertType(alertType)
            setReload(true)
        }
    }
    
    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Manage Users</h1>
                </div>
                <section className="section">
                    <div className="card">
                        <div className='card-header'>
                            <Alert key={alertType} variant={alertType}>
                                {message}
                            </Alert>
                            <UsersIU editRow={editRow} handleModalClosed={handleModalClosed} />
                        </div>
                        <div className="card-body">
                            <Grid api='http://dms.admee.co.uk/users' editRow={editRowAction} reload={reloadGrid}/>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Users;
