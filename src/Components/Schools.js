
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import SchoolsIU from './SchoolsIU'
import Alert from 'react-bootstrap/Alert';

function Schools() {
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
                    <h1>Manage Schools</h1>
                </div>
                <section className="section">
                    <div className="card">
                        <div className="card-header">
                            <Alert key={alertType} variant={alertType}>
                                {message}
                            </Alert>
                            <SchoolsIU editRow={editRow} handleModalClosed={handleModalClosed} />
                        </div >
                        <div className="card-body">
                            <Grid api='http://beyghairat.admee.co.uk:8000/school/' editRow={editRowAction} />
                        </div>
                    </div>
                </section>
            </main>
        </>);
}

export default Schools;