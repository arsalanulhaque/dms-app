import FetchData from '../Hooks/FetchData'
import React, { useContext, useEffect, useState, } from "react";
import SessionContext from '../Context/SessionContext'
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function Login() {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    const [alertType, setAlertType] = useState('')
    const [message, setMessage] = useState('')


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
                    session.message = result?.data?.message
                    session.data = result?.data?.data
                    session.error = result?.data?.error
                    session.isAdmin = result?.data?.data[0].PreviligeName === 'Admin' ? true : false
                    session.isAppDeveloper = result?.data?.data[0].PreviligeName === 'AppDeveloper' ? true : false
                    //session.isSuperAdmin = result.data.data[0].PreviligeName === 'Super Admin' ? true : false
                    session.schoolID = result?.data?.data[0].SchoolID
                    session.userID = result?.data?.data[0].UserID
                    session.emailID = result?.data?.data[0].EmailID

                    if (result.code === 'ERR_NETWORK') {
                        setAlertType('danger')
                        setMessage(result?.message)
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
                            <div className="card mb-3">
                                <div className="card-title p-4 ">
                                    <h5 className=" text-center pb-0 fs-4">Scan Your ID Card to Login</h5>
                                </div>
                                <div className="card-body">
                                    <input
                                        name="NfcID"
                                        type="text"
                                        className="form-control "
                                        onChange={(evt) => { onSubmit(evt.target.value) }}
                                        autoFocus
                                    />
                                </div>
                                {
                                alertType ==='danger'? 
                                <div className="card-footer">
                                    <Alert key={alertType} variant={alertType}>
                                        {message}
                                    </Alert>
                                </div>
                                :<></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;