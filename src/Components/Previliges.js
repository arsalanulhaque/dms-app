
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import PreviligesIU from './PreviligesIU'
import Alert from 'react-bootstrap/Alert';

function Previliges() {
    const [editRow, setEditRow] = useState({})
    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')

    const editRowAction = (params) => {
        setEditRow(params.row)
    }

    const handleModalClosed = (message, alertType, isClosed) => {
        if (isClosed) {
            setEditRow(null)
            setMessage(message)
            setAlertType(alertType)
        }
    }

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Manage Roles</h1>
                </div>
                <section className="section">
                    <div className="card">
                        <div className="card-header">
                            <Alert key={alertType} variant={alertType}>
                                {message}
                            </Alert>
                            <PreviligesIU editRow={editRow} handleModalClosed={handleModalClosed} />
                        </div>
                        <div className="card-body">
                            <Grid api='http://localhost:8000/previlige/' editRow={editRowAction} />
                        </div>

                    </div>
                </section>
            </main >
        </>
    );
}

export default Previliges;