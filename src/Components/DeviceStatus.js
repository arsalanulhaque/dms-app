
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import { SessionContext } from '../Context/SessionContext'
import React, { useContext } from 'react';

function DeviceStatus() {
    const { session } = useContext(SessionContext);

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
                                        <h1>Device History</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <Grid api={session.isAppDeveloper === true ? `devicestatus` : `devicestatus/school/${session.schoolID}`} />
                        </div>
                    </div>
                </section >
            </main >
        </>
    );
}

export default DeviceStatus;