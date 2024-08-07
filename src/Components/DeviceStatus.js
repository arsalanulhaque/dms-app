
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import SessionContext from '../Context/SessionContext'
import React, { useContext } from 'react';

function DeviceStatus() {
    const { session } = useContext(SessionContext);

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Device History</h1>
                </div>
                {/* <!-- End Page Title --> */}
                <section className="section">
                    <div className="row">
                        <div className="col">
                            {/* <!--Content Start -- > */}
                            <div className="card">
                                <div className="card-body">
                                    <Grid api={session.isAppDeveloper === true ? `devicestatus` : `devicestatus/school/${session.schoolID}`} />
                                </div>
                            </div>
                            {/* <!--Content End -- > */}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}

export default DeviceStatus;