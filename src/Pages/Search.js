import React, { useContext, useState, } from "react";
import SessionContext from '../Context/SessionContext'
import FetchData from '../Hooks/FetchData'
import Header from '../Components/Header';
import iconSearch from '../assets/img/search.png'
import Alert from 'react-bootstrap/Alert';
import '../style.css'

function Search() {
    const { session } = useContext(SessionContext);
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')
    const [isLoader, setLoader] = useState(false)
    const [results, setResults] = useState([])


    const reset = () => {
        setResults([])
        setAlertType('info')
        setMessage('')
    }

    const onSubmit = (event) => {
        event.preventDefault()
        reset()
        let httpMethod = 'post'
        let endpoint = 'search'
        let body = {
            "Criteria": {
                input: event.target[0].value,
                schoolID: session.schoolID
            }
        }

        FetchData(endpoint, httpMethod, body, (result) => {
            if (result.data.error) {
                setAlertType('danger')
                setMessage(result.data.message)
            }
            else {
                setResults(result.data.data)
                setAlertType('success')
                setMessage('')
            }
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
                DeviceStatusID: prod.FKDeviceStatusID,
                SchoolID: session.schoolID,
                UserID: session.userID,
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
                DeviceID: prod.DeviceID,
                SchoolID: session.schoolID,
                IsIssued: isIssued
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


    return (
        <>
            <Header />
            <div className="container">
                <div className="d-flex justify-content-md-center align-items-center search">
                    <div className="row w-75 ">
                        <form onSubmit={onSubmit}>
                            <div className="d-flex rounded justify-content-md-center align-items-center">
                                <div className="input-group input-group-lg">
                                    <input type="text" className="form-control" placeholder="Find a device by it`s AssetID" name="search" />
                                    <button style={{ border: 100 }} className="rounded-end">
                                        <img src={iconSearch} alt="Search" height='45' />
                                    </button>
                                </div>
                            </div>
                        </form>
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
                                results.map((prod) =>
                                    <div className="col-sm-3">
                                        <div className="card border border-2 rounded">
                                            <div className="card-body">
                                                <div className="row card-title bottom border-1 border-bottom" >
                                                    <div className="col-7 text-primary">
                                                        <h5 >Asset# {prod.AssetID}</h5>
                                                    </div>
                                                    <div className="col-5">
                                                        {prod.IsIssued === 0 ? <span className="btn-bookNow fs-6 float-end fw-bold text-warning" onClick={() => onBookDevice(prod)}>Book Now</span> : ''}
                                                        {prod.IsIssued === 1 && prod.FKUserID !== session.UserID ?
                                                            <span className="btn-bookNow fs-6 float-end fw-bold text-danger" onClick={() => onReturnDevice(prod)}>Return Now</span> :
                                                            prod.IsIssued === 1 && prod.FKDeviceStatusID === prod.DeviceID ?
                                                                <span className="btn-already-booked fs-6 float-end fw-bold">Already Booked</span> : ''}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-8">
                                                        <p className="card-text">Device Name: {prod.DeviceName}</p>
                                                        <p className="card-text">Model: {prod.Model}</p>
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