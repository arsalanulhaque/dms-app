
import Header from './Header';
import Sidebar from './Sidebar';
import Grid from './Controls/Grid';
import DeviceStatusIU from './DeviceStatusIU'

function DeviceStatus() {
    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Manage Device Status</h1>
                </div>
                {/* <!-- End Page Title --> */}
                <section className="section">
                    <div className="row">
                        <div className="col">
                            {/* <!--Content Start -- > */}
                            <div className="card">
                                <div className='card-header'>
                                    <DeviceStatusIU />
                                </div>
                                <div className="card-body">
                                    <Grid api='http://beyghairat.admee.co.uk:8000/devicestatus/' />
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