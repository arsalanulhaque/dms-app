import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useCallback, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Alert from 'react-bootstrap/Alert';
import useSession from '../Context/SessionContext'
import iconInfo from '../assets/img/info_icon.png'
import readXlsxFile from 'read-excel-file';
import FetchData from '../Hooks/FetchData'

function DevicesBulk() {
    const [getSession, setSession] = useSession()
    const [data, setData] = useState(undefined)

    const [message, setMessage] = useState('')
    const [alertType, setAlertType] = useState('')


    const handleFile = useCallback((e) => {
        readXlsxFile(e.target.files[0]).then((rows) => {
            if (rows) {
                rows = assignAttributes(rows)
            }
        })
    }, [])

    const assignAttributes = (devices) => {
        let keys = devices[0]
        let rows = devices.splice(1, devices.length)

        let arr = []
        let obj = {}

        rows.forEach((row, rowInd) => {
            obj={}
            row.forEach((col, colInd) => {
                obj[keys[colInd]] = col
            })
            obj.SchoolID = getSession().schoolID
            arr.push(obj)
        })

        setData(arr)
    }

    const onUpload = () => {
        const body = { devices: data.splice(1, data.length) }
        FetchData('device/bulkupload', 'post', body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else {
                setAlertType('success')
                setMessage(response?.data?.message)
                setData(undefined)
            }
        })
    }

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">

                <section className="section">
                    <div className="card">
                        <div className="card-header">
                            <div className='row mb-2 ' >
                                <div className='col d-flex align-items-start' >
                                    <div className="pagetitle m-0 mt-1">
                                        <h1>Devices - Bulk Upload</h1>
                                    </div>
                                </div>
                                <div className='col d-flex align-items-start justify-content-end'>
                                    <input type="file" value='' onChange={(e) => handleFile(e)} className="btn btn-sm  btn-secondary mr-2" style={{ maxWidth: '100%' }} />
                                    <button type="button" className="btn btn-primary " onClick={onUpload}>
                                        Upload Devices
                                    </button>
                                </div>
                            </div>
                            {message.length === 0 ? '' :
                                <Alert className='m-0 p-2' key={alertType} variant={alertType}>
                                    {message}
                                </Alert>}
                        </div>
                        <div className="card-body m-2">

                            {
                                !data ?
                                    <div className="row mt-2">
                                        <div className="col d-flex justify-content-start align-items-center fs-6 fw-bold">
                                            <img src={iconInfo} className="icon-48" />
                                            <div className="px-3">
                                                <div className="  text-secondary w-100">Please select an excel file (.xlsx) file to begin! </div>
                                                <div className="  text-secondary w-100"><a href={`${process.env.PUBLIC_URL}\\Bulk_Device_Template.xlsx`} download="Bulk Device Template.xlsx" className="text-primary">Download</a> the attached excel file to use as template! </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div className='row border border-1 border-secondary bg-secondary text-light'>
                                            <div className="col p-2 fw-bold">IMEI</div>
                                            <div className="col p-2 fw-bold">Device Name</div>
                                            <div className="col p-2 fw-bold">Model</div>
                                            <div className="col p-2 fw-bold">AssetID</div>
                                        </div>
                                        {
                                            data?.map(row => {
                                                return <div className='row border border-1 border-secondary'>
                                                    <div className="col p-2">{row.IMEI}</div>
                                                    <div className="col p-2">{row.DeviceName}</div>
                                                    <div className="col p-2">{row.Model}</div>
                                                    <div className="col p-2">{row.AssetID}</div>
                                                </div>
                                            })
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default DevicesBulk;