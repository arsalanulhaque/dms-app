import React, { useContext, useEffect, useState, useRef, } from "react";
import SessionContext from '../Context/SessionContext'
import FetchData from '../Hooks/FetchData'
import Header from '../Components/Header';
import iconSearch from '../assets/img/search.png'
import Alert from 'react-bootstrap/Alert';
import '../style.css'
import { Link } from "react-router-dom";

function Till() {
    const { session } = useContext(SessionContext);
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')
    const [isLoader, setLoader] = useState(false)
    const [results, setResults] = useState([])
    const inputRef = useRef(null);

    useEffect(() => {
        let intervalID = setInterval(() => {
            inputRef.current.focus()
        }, 1000);

        return (() => {
            clearInterval(intervalID)
        })
    }, [])

    const reset = () => {
        setResults([])
        setAlertType('info')
        setMessage('')
        inputRef.current.value=''
    }

    const onSubmit = (event) => {
        event.preventDefault()
        console.log(inputRef.current.value)
        setTimeout(() => {
            reset() 
            console.log(inputRef.current.value)

        }, 2000);
        // reload('search', 'post', event)
    }

    const reload = (api, method, event) => {
        let httpMethod = method
        let endpoint = api
        let body
        if (event != undefined) {
            body = {
                "Criteria": {
                    input: event.target[0].value,
                    schoolID: session.schoolID
                }
            }
        }
        FetchData(endpoint, httpMethod, body, (result) => {
            if (result?.error) {
                setAlertType('danger')
                setMessage(result?.data?.message)
            }
            else {
                setResults(api === 'search' ? result?.data?.data : result?.data)
                setAlertType('success')
                setMessage('')
            }
        })

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
                                    <Link to='/managedevicestatus' >Show Devices</Link>
                                    <input type="text" ref={inputRef} className="hidden-form-control" name="search" />
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
                                results?.map((prod) =>
                                    <div key={prod.AssetID} className="col-4" >
                                        <div className="card border border-2 rounded">
                                            <div className="card-body">
                                                <div className="row card-title bottom border-1 border-bottom" >
                                                    <div className="col text-primary">
                                                        <h5 >Asset# {prod.AssetID}</h5>
                                                    </div>
                                                    <div className="col-5">
                                                        {/* {prod.IsIssued === 0 ? <span className="btn-bookNow fs-6 float-end fw-bold text-warning" onClick={() => onBookDevice(prod)}>Book Now</span> : ''}
                                                        {prod.IsIssued === 1 && prod.FKUserID === session.userID ?
                                                            <span className="btn-bookNow fs-6 float-end fw-bold text-danger" onClick={() => onReturnDevice(prod)}>Return Now</span> : ''} */}
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

export default Till;