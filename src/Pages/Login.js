import FetchData from '../Hooks/FetchData'
import React, { useContext, useEffect, useRef, useState, } from "react";
import useSession from '../Context/SessionContext'
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { Link } from "react-router-dom";
import iconLogin from '../assets/img/login_icon.png'


function Login() {
    const navigate = useNavigate();
    const [getSession, setSession] = useSession();
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')
    const inputRef = useRef(null);

    useEffect(() => {
        let intervalID = setInterval(() => {
            inputRef.current.focus()
        }, 1000);

        return (() => {
            clearInterval(intervalID)
        })
    }, [])

    const onSubmit = (data) => {
        if (data.length > 10) {
            let httpMethod = 'post'
            let endpoint = 'login'
            let body = {
                Credentials: {
                    NfcID: data,
                }
            }

            FetchData(endpoint, httpMethod, body, (result) => {
                if (result?.data?.error) {
                    setTimeout(() => {
                        setAlertType('danger')
                        setMessage(result?.data?.message)
                    }, 3000)
                }
                else {
                    let _session = {
                        message: result?.data?.message,
                        data: result?.data?.data,
                        error: result?.data?.error,
                        isAdmin: result?.data?.data[0].PreviligeName === 'Admin' ? true : false,
                        isAppDeveloper: result?.data?.data[0].PreviligeName === 'AppDeveloper' ? true : false,
                        //getSession()?.isSuperAdmin = result.data.data[0].PreviligeName === 'Super Admin' ? true : false
                        schoolID: result?.data?.data[0].SchoolID,
                        userID: result?.data?.data[0].UserID,
                        emailID: result?.data?.data[0].EmailID,
                        previligeID: result?.data?.data[0].PreviligeID
                    }
                    setSession(_session)


                    if (result.code === 'ERR_NETWORK') {
                        setAlertType('danger')
                        setMessage(result?.message)
                        inputRef.current.value = ''
                    }
                    else if (result?.data?.data[0].PreviligeName === 'Staff') {
                        navigate('/search')
                    }
                    else {
                        navigate('/dashboard')
                    }
                }
            })
        }
    }

    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="card mb-3 border border-1">
                                <div className="card-header bg-light d-flex flex-row align-items-center">
                                    <img src={iconLogin} className="icon-48" />
                                    <h1 className="">Login</h1>
                                </div>
                                <div className="card-body">
                                    <div className="card-title px-4 ">
                                        <h5 className="text-center">Please scan your card to begin.</h5>
                                    </div>
                                    <input
                                        name="NfcID"
                                        type="text"
                                        className="form-control "
                                        onChange={(evt) => { onSubmit(evt.target.value) }}
                                        ref={inputRef}
                                        autoFocus
                                    />
                                    {
                                        alertType === 'danger' ?
                                            <Alert className='mt-2' key={alertType} variant={alertType}>
                                                {message}
                                            </Alert>
                                            : <></>
                                    }
                                </div>
                                <div className="card-footer bg-light m-0 p-0">

                                    <div className="m-2 d-flex flex-column align-items-end justify-content-center ">
                                        <Link to='/admin' className="link-primary">Login with Credentials</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;