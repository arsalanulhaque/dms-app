import React, { useContext, useEffect, useState, useRef, } from "react";
import SessionContext from '../Context/SessionContext'
import FetchData from '../Hooks/FetchData'
import Header from '../Components/Header';
import Alert from 'react-bootstrap/Alert';
import '../style.css'
import { Link } from "react-router-dom";

function Search() {
    const inputRef = useRef(null);
    const { session } = useContext(SessionContext);
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')
    const [isLoader, setLoader] = useState(false)
    const [results, setResults] = useState([])

    useEffect(() => {
        let intervalID = setInterval(() => {
            inputRef.current.focus()
        }, 1000);

        return (() => {
            clearInterval(intervalID)
        })
    }, [])



    const onSubmit = (event) => {
        event.preventDefault()
        // reload('search', 'post', inputRef.current.value)

    }

    const reload = (api, method, body) => {
        FetchData(api, method, body, (response) => {
            if (response?.error) {
                setAlertType('danger')
                setMessage(response?.data?.message)
            }
            else if (response?.data?.length > 0 || response?.data?.data?.length > 0) {
                let arr = response?.data
                let isExists = results.findIndex(item => item.AssetID === arr[0].AssetID)
                if (isExists === -1) {
                    let spreaded = [...arr, ...results]
                    spreaded = [...new Set(spreaded)]
                    setResults(spreaded)

                    setAlertType('success')
                    setMessage('')
                }
            }
        })
        inputRef.current.value = ''
    }

    const onScanItem = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (results.length === 0) {
                reload(`device/barcode/${inputRef.current.value}`, 'get', undefined)
                findItemInList()
            }
            else if (results.length > 0) { findItemInList() }
        }
    }

    //Insert in bulk in Device Status Table to Book devices 
    const bulkInsert = async () => {
        setLoader(true)
        let httpMethod = 'post'
        let endpoint = 'bulkinsertdevicestatus'
        let body = {
            "devicestatus": {
                SchoolID: session.schoolID,
                UserID: session.userID,
                EmailID: session.emailID,
                Rows: results,
            }
        }

        await FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.data?.error) {
                setAlertType('danger')
                setMessage("Something wrong went!")
                return false
            }
            else {
                setResults([])
                setAlertType('success')
                setMessage("Device has been issued successfully.")
            }
            setLoader(false)
        })
    }

    //Return in bulk in Device Status Table to Book devices 
    const bulkReturn = async () => {
        setLoader(true)
        let httpMethod = 'post'
        let endpoint = 'bulkinsertdevicestatus'
        let body = {
            "devicestatus": {
                SchoolID: session.schoolID,
                UserID: session.userID,
                EmailID: session.emailID,
                Rows: results,
            }
        }

        await FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.data?.error) {
                setAlertType('danger')
                setMessage("Something wrong went!")
                return false
            }
            else {
                setResults([])
                setAlertType('success')
                setMessage("Device has been issued successfully.")
            }
            setLoader(false)
        })
    }

    //Insert new record in Device Status Table 
    const insertDeviceStatus = async (prod) => {
        let httpMethod = 'post'
        let endpoint = 'devicestatus'
        let body = {
            "devicestatus": {
                DeviceID: prod.DeviceID,
                SchoolID: session.schoolID,
                UserID: session.userID,
                EmailID: session.emailID,
                AssetID: prod.AssetID
            }
        }

        await FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.data?.error) {
                return false
            }
            else {
                return true
            }
        })
    }

    //Update return status in Device Status Table 
    const updateReturnDeviceStatus = async (prod) => {
        let httpMethod = 'put'
        let endpoint = 'returndevicestatus'
        let body = {
            "devicestatus": {
                DeviceStatusID: prod.DeviceStatusID,
                SchoolID: session.schoolID,
                UserID: session.userID,
                EmailID: session.emailID,
                AssetID: prod.AssetID
            }
        }

        await FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.data?.error) {
                return false
            }
            else {
                return true
            }
        })
    }

    //Update Issued column in Device Table
    const updateDeviceStatus = async (prod, isIssued) => {
        let httpMethod = 'put'
        let endpoint = isIssued === 1 ? 'issuedevice' : 'returndevice'
        let body = {
            "device": {
                DeviceID: prod.FKDeviceID,
                SchoolID: session.schoolID,
                IsIssued: isIssued,
                EmailID: session.emailID,
                AssetID: prod.AssetID
            }
        }

        await FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.data?.error) {
                return false
            }
            else {
                return true
            }
        })
    }


    const onBookDevice = async (prod) => {
        setLoader(true)
        let flag = false
        if (insertDeviceStatus(prod)) {
            setTimeout(() => {
                if (updateDeviceStatus(prod, 1)) {
                    flag = true
                }

                if (flag) {
                    setResults([])
                    setAlertType('success')
                    setMessage("Device has been issued successfully.")
                }
                else {
                    setAlertType('danger')
                    setMessage("Something wrong went!")
                }
                setLoader(false)
            }, 3000);
        }
    }

    const onReturnDevice = async (prod) => {
        setLoader(true)
        let flag = false
        if (updateReturnDeviceStatus(prod)) {
            setTimeout(() => {
                if (updateDeviceStatus(prod, 0)) {
                    flag = true
                }

                if (flag) {
                    setResults([])
                    setAlertType('success')
                    setMessage("Device has been returned successfully.")
                }
                else {
                    setAlertType('danger')
                    setMessage("Something wrong went!")
                }
                setLoader(false)
            }, 3000);
        }
    }

    const findItemInList = () => {
        let updateSelection = results.map((obj) => {
            if (obj.BarCode === inputRef.current.value) {
                if (obj['selected'] === undefined)
                    obj.selected = true
                else
                    obj.selected = !obj.selected
            }
            return obj
        })
        setResults(updateSelection)
        inputRef.current.value = ''
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className=" justify-content-md-center align-items-center search">
                    <div className="row w-100 ">
                        <form onSubmit={onSubmit}>
                            <div className="d-flex rounded justify-content-md-center align-items-center">
                                <div className="input-group input-group-lg">
                                    <Link to='/managedevicestatus' >Show Devices</Link>
                                    <input type="text" ref={inputRef} onKeyDown={onScanItem} className="hidden-form-control" name="search" />
                                </div>
                            </div>
                        </form>
                        <button className='btn btn-primary' onClick={results.filter(i => i.IsIssued === 0)?.length > 0 ? bulkInsert : bulkReturn}>
                            {results.filter(i => i.IsIssued === 0)?.length > 0 ? 'Book Now' : 'Return Now'}
                        </button>
                    </div>
                </div>
                {
                    isLoader === true ?
                        <div className="d-flex rounded justify-content-md-center align-items-center w-100 mt-5 mr-5">
                            <div className="row h-50 d-inline-block">
                                <div className="col-12">
                                    <div className="spinner-border text-primary spinner-big" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                }
                {
                    message?.length > 0 ?
                        <div className=" d-flex justify-content-md-center align-items-center search">
                            <div className="row w-50">
                                <Alert key={alertType} variant={alertType} className="w-100">
                                    {message}
                                </Alert>
                            </div>
                        </div>
                        : ''
                }
            </div>
            {
                isLoader === false ?
                    <div className="container-fluid mt-5">
                        <div className="row">
                            {
                                results?.map((prod) =>
                                    <div key={prod.AssetID} className="col-4" >
                                        <div className={prod?.selected ? "card border border-warning border-4 rounded" : "card border border-2 rounded"}>
                                            <div className="card-body">
                                                <div className="row card-title bottom border-1 border-bottom" >
                                                    <div className="col text-primary">
                                                        <h5 >Asset# {prod.AssetID}</h5>
                                                    </div>
                                                    <div className="col-5">
                                                        {prod.IsIssued === 0 ? <span className="btn-bookNow fs-6 float-end fw-bold text-warning" onClick={() => onBookDevice(prod)}>Book Now</span> : ''}
                                                        {prod.IsIssued === 1 && prod.FKUserID === session.userID ?
                                                            <span className="btn-bookNow fs-6 float-end fw-bold text-danger" onClick={() => onReturnDevice(prod)}>Return Now</span> : ''}
                                                        {prod.IsIssued === 1 && prod.FKUserID !== session.userID ?
                                                            <span className="btn-already-booked fs-6 float-end fw-bold">Already Booked</span> : ''}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="row">
                                                            <div className="col-6 card-text">Device Name: {prod.DeviceName}</div>
                                                            <div className="col-6 card-text">Model: {prod.Model}</div>
                                                            <div className="col-6 card-text">Staff: {prod.ReturnDate === null ? <span className="fw-bold text-danger">{prod.Username}</span> : 'NA'} </div>
                                                            <div className="col-6 card-text">Taken On: {prod.ReturnDate === null ? <span className="fw-bold text-danger">{prod.IssuedDate}</span> : 'NA'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    : ''
            }
        </>
    );
}

export default Search;