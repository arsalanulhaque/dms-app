
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import useSession from '../Context/SessionContext'
import React from 'react';

function DeviceStatus() {
    const [getSession, setSession] = useSession()

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
                            <Grid api={getSession()?.isAppDeveloper === true ? `devicestatus` : `devicestatus/school/${getSession()?.schoolID}`} />
                        </div>
                    </div>
                </section >
            </main >
        </>
    );
}

export default DeviceStatus;