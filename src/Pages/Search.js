import '../style.css'
import React, { useContext, useEffect, useState, useRef, } from "react";
import useSession from '../Context/SessionContext'
import FetchData from '../Hooks/FetchData'
import Header from '../Components/Header';
import DeviceList from '../Components/DeviceList';
import Alert from 'react-bootstrap/Alert';
import iconError from '../assets/img/error_icon.png'
import iconSuccess from '../assets/img/success_icon.png'

function Search() {
    const inputRef = useRef(null);
    const [getSession, setSession] = useSession()
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')
    const [isLoader, setLoader] = useState(false)
    const [lstIssuedDevices, setIssuedDevices] = useState([])
    const [lstAvailableDevices, setAvailableDevices] = useState([])
    const [lstUnavailableDevices, setUnavailableDevices] = useState([])


    useEffect(() => {
        let intervalID = setInterval(() => {
            inputRef.current.focus()
        }, 1000);

        return (() => {
            clearInterval(intervalID)
        })
    }, [])

    const onItemScan = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            makeRequest(`device/barcode/${inputRef.current.value}/schoolID/${getSession()?.schoolID}`, 'get', undefined)
        }
    }

    const makeRequest = (api, method, body) => {
        FetchData(api, method, body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else if (response?.data?.length > 0 || response?.data?.data?.length > 0) {
                let device = response?.data[0]
                //Available devices
                addToAvailableDevices(device)
                //Devices issued to logged in user
                addToIssuedDevices(device)
                //Devices reserved by someone else
                addToOccupiedDevices(device)
            }
        })
        inputRef.current.value = ''
    }

    const addToAvailableDevices = (device) => {
        if (device.Username === null) {
            if (!isDeviceInList(device, lstAvailableDevices) && lstIssuedDevices.length === 0) {
                device.UserID = getSession()?.userID
                device.EmailID = getSession()?.emailID
                device.Username = getSession().data[0]?.Username
                let spreaded = [...lstAvailableDevices, device]
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0))
                setSelectedOnScan(spreaded)
                setAvailableDevices(spreaded)
            }
            else {
                setAlertType('danger')
                setMessage('You can`t take a device while returning devices!')
            }
        }
    }

    const addToIssuedDevices = (device) => {
        if (device.IsIssued === 1 && device.FKUserID === getSession()?.userID) {
            if (!isDeviceInList(device, lstIssuedDevices) && lstAvailableDevices.length === 0) {
                device.UserID = getSession()?.userID
                device.EmailID = getSession()?.emailID
                let spreaded = [...lstIssuedDevices, device]
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0))
                setSelectedOnScan(spreaded)
                setIssuedDevices(spreaded)
            }
            else {
                setAlertType('danger')
                setMessage('You can`t return a device while booking new devices!')
            }
        }
    }

    const addToOccupiedDevices = (device) => {
        if (device.IsIssued === 1 && device.FKUserID !== getSession()?.userID) {
            if (!isDeviceInList(device, lstUnavailableDevices)) {
                device.FKUserID = getSession()?.userID
                let spreaded = [...lstUnavailableDevices, device]
                //spreaded = [...new Set(spreaded)]
                spreaded.sort((a, b) => (a.IsIssued > b.IsIssued) ? 1 : ((b.IsIssued > a.IsIssued) ? -1 : 0))
                setSelectedOnScan(spreaded)
                setUnavailableDevices(spreaded)
            }
        }
    }

    const isDeviceInList = (device, list) => {
        return list.findIndex(item => item.AssetID === device.AssetID) === -1 ? false : true
    }

    const setSelectedOnScan = (obj) => {
        obj.forEach(element => {
            if (element.IssuedDate === null || element.IssuedDate === 1) {
                element.selected = true
            } else {
                element.selected = false
            }
        });
    }

    const handleCheckout = () => {
        const body = { devices: lstAvailableDevices?.length > 0 ? lstAvailableDevices : lstUnavailableDevices }
        FetchData('device/checkout', 'put', body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else {
                setAlertType('success')
                setMessage(response?.data?.message)
                reset()
            }
        })
    }

    const handleCheckIn = () => {
        const body = { devices: lstIssuedDevices }
        FetchData('device/checkin', 'put', body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else {
                setAlertType('success')
                setMessage(response?.data?.message)
                reset()
            }
        })
    }

    const reset = () => {
        setIssuedDevices([...new Set([])])
        setAvailableDevices([...new Set([])])
        setUnavailableDevices([...new Set([])])
    }

    return (
        <>
            <input type="text" ref={inputRef} className="hidden-form-control" onKeyDown={onItemScan} name="search" />
            <Header />
            <div className="container fill mb-0 search">

                {/* <div className="row border border-bottom-1">
                    <div className="col my-2">
                        <Link to='/managedevicestatus'>Check Device Status</Link>
                    </div>
                    <div className="col p-2">

                    </div>
                    <div className="col-1 d-flex justify-content-end p-2">
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => reset()}>Remove All</button>
                    </div>
                </div> */}
                {
                    message?.length === 0 ? '' :
                        <div className="row justify-content-center">
                            <div className="col-6">

                                <Alert key={alertType} variant={alertType} className="mt-2"
                                    onClose={() => {
                                        setMessage('')
                                    }} dismissible>
                                    {alertType === 'danger' ?
                                        <img src={iconError} alt='' className="icon-48" /> :
                                        alertType === 'success' ?
                                            <img src={iconSuccess} alt='' className="icon-48" />
                                            : ''}
                                    <span className='px-2 fs-5'>{message}</span>
                                </Alert>
                            </div>
                        </div>
                }

                {
                    isLoader === true ?
                        <div className="row justify-content-center">
                            <div className="col-1 align-items-center m-5 p-5">
                                <div className="spinner-border text-primary spinner-big" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                        :

                        <div className="row mt-2">
                            {
                                lstUnavailableDevices.length > 0 ?
                                    <div className="col w-100 ">
                                        <DeviceList state="unavailable" title='Occupied Devices' titleStyle='text-danger' handleCheckout={handleCheckout} products={lstUnavailableDevices} />
                                    </div> : ''
                            }
                            {
                                lstAvailableDevices.length > 0 ?
                                    <div className="col w-100 ">
                                        <DeviceList state="available" title='Available Devices' titleStyle='text-success' handleCheckout={handleCheckout} products={lstAvailableDevices} />
                                    </div> : ''
                            }
                            {
                                lstIssuedDevices.length > 0 ?
                                    <div className="col w-100 ">
                                        <DeviceList state="return" title='Return Devices' titleStyle='text-info' handleCheckin={handleCheckIn} products={lstIssuedDevices} />
                                    </div> : ''
                            }
                        </div>
                }

                {
                    lstUnavailableDevices.length === 0 && lstAvailableDevices.length === 0 && lstIssuedDevices.length === 0 ?
                        <div className="card m-2">
                            <div className="card-body ">
                                <div className="row align-items-center justify-content-md-center map m-0 p-0 ">
                                    <div className="col-md-auto align-items-center text-info">
                                        <p className='fs-3'>Ready...?</p>
                                        <p className='fs-5'>Start scanning your devices now!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                }
            </div>
        </>
    );
}

export default Search;